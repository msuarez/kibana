import { withHandlers } from 'recompose';

const ancestorElement = (element, className) => {
  if (!element) return element;
  do {
    if (element.classList.contains(className)) return element;
  } while ((element = element.parentElement));
};

const localMousePosition = (target, clientX, clientY) => {
  const ancestor = ancestorElement(target, 'canvasPage') || target;
  const box = ancestor.getBoundingClientRect(); // causes reflow, fixme check performance impact
  return {
    x: clientX - box.left,
    y: clientY - box.top,
  };
};

const setupHandler = (commit, target) => {
  window.onmousemove = ({ clientX, clientY, altKey, metaKey }) => {
    const { x, y } = localMousePosition(target, clientX, clientY);
    commit('cursorPosition', { x, y, altKey, metaKey });
  };
  window.onmouseup = e => {
    e.stopPropagation();
    const { clientX, clientY, altKey, metaKey } = e;
    const { x, y } = localMousePosition(target, clientX, clientY);
    commit('mouseEvent', { event: 'mouseUp', x, y, altKey, metaKey });
    window.onmousemove = null;
    window.onmouseup = null;
  };
};

const handleMouseMove = (commit, { target, clientX, clientY, altKey, metaKey }) => {
  // mouse move must be handled even before an initial click
  if (!window.onmousemove) {
    const { x, y } = localMousePosition(target, clientX, clientY);
    setupHandler(commit, target);
    commit('cursorPosition', { x, y, altKey, metaKey });
  }
};

const handleMouseDown = (commit, e, isEditable) => {
  e.stopPropagation();
  const { target, clientX, clientY, button, altKey, metaKey } = e;
  if (button !== 0 || !isEditable) return; // left-click and edit mode only
  const ancestor = ancestorElement(target, 'canvasPage');
  if (!ancestor) return;
  const { x, y } = localMousePosition(ancestor, clientX, clientY);
  setupHandler(commit, ancestor);
  commit('mouseEvent', { event: 'mouseDown', x, y, altKey, metaKey });
};

const keyCode = key => (key === 'Meta' ? 'MetaLeft' : 'Key' + key.toUpperCase());

const isNotTextInput = ({ tagName, type }) => {
  // input types that aren't variations of text input
  const nonTextInputs = [
    'button',
    'checkbox',
    'color',
    'file',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
  ];

  switch (tagName.toLowerCase()) {
    case 'input':
      return nonTextInputs.includes(type);
    case 'textarea':
      return false;
    default:
      return true;
  }
};

const handleKeyDown = (commit, e, editable, remove) => {
  const { key, target } = e;

  if (editable) {
    if (isNotTextInput(target) && (key === 'Backspace' || key === 'Delete')) {
      e.preventDefault();
      remove();
    } else {
      commit('keyboardEvent', {
        event: 'keyDown',
        code: keyCode(key), // convert to standard event code
      });
    }
  }
};

const handleKeyUp = (commit, { key }) => {
  commit('keyboardEvent', {
    event: 'keyUp',
    code: keyCode(key), // convert to standard event code
  });
};

export const withEventHandlers = withHandlers({
  onMouseDown: props => e => handleMouseDown(props.commit, e, props.isEditable),
  onMouseMove: props => e => handleMouseMove(props.commit, e),
  onKeyDown: props => e => handleKeyDown(props.commit, e, props.isEditable, props.remove),
  onKeyUp: props => e => handleKeyUp(props.commit, e),
});
