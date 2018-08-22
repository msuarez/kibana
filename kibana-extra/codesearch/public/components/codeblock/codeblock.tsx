/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiPanel, EuiText } from '@elastic/eui';
import { initMonaco, Monaco } from 'init-monaco';
import { editor, IPosition } from 'monaco-editor';
import React from 'react';
import { ResizeChecker } from 'ui/resize_checker';

interface Props {
  code: string;
  file?: string;
  startLine?: number;
  language?: string;
  onClick?: (event: IPosition) => void;
}

export class CodeBlock extends React.PureComponent<Props> {
  private el: HTMLDivElement | null = null;
  private ed?: editor.IStandaloneCodeEditor;
  private resizeChecker?: ResizeChecker;

  public componentDidMount(): void {
    if (this.el) {
      initMonaco((monaco: Monaco) => {
        this.ed = monaco.editor.create(this.el!, {
          value: this.props.code,
          language: this.props.language,
          lineNumbers: this.lineNumbersFunc,
          readOnly: true,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: 'hidden',
            handleMouseWheel: false,
            verticalScrollbarSize: 0,
          },
          hover: {
            enabled: false, // disable default hover;
          },
          contextmenu: false,
          selectOnLineNumbers: false,
          selectionHighlight: false,
          renderLineHighlight: 'none',
        });
        this.ed.onMouseDown((e: editor.IEditorMouseEvent) => {
          if (
            this.props.onClick &&
            (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
              e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT)
          ) {
            const lineNumber = (this.props.startLine || 0) + e.target.position.lineNumber;
            this.props.onClick({
              lineNumber,
              column: e.target.position.column,
            });
          }
        });
        this.resizeChecker = new ResizeChecker(this.el!);
        this.resizeChecker.on('resize', () => {
          setTimeout(() => {
            this.ed!.layout();
          });
        });
      });
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.code !== this.props.code) {
      if (this.ed) {
        this.ed.getModel().setValue(nextProps.code);
      }
    }
  }

  public componentWillUnmount(): void {
    if (this.ed) {
      this.ed.dispose();
    }
  }

  public render() {
    const linesCount = this.props.code.split('\n').length;
    return (
      <EuiPanel>
        {this.props.file && <EuiText>{this.props.file}</EuiText>}
        <div ref={r => (this.el = r)} style={{ height: linesCount * 18 }} />
      </EuiPanel>
    );
  }

  private lineNumbersFunc = (line: number) => {
    return `${(this.props.startLine || 0) + line}`;
  };
}
