/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createAction } from 'redux-actions';
import { FileTree } from '../../model';
import { CommitInfo, ReferenceInfo } from '../../model/commit';

export interface FetchRepoPayload {
  uri: string;
}

export interface FetchRepoPayloadWithRevision extends FetchRepoPayload {
  revision: string;
}
export interface FetchFilePayload extends FetchRepoPayloadWithRevision {
  path: string;
}
export interface FetchRepoTreePayload extends FetchFilePayload {
  depth?: number;
}

export interface FetchFileResponse {
  content: string;
  lang?: string;
  isImage?: boolean;
}

export const fetchRepoTree = createAction<FetchRepoTreePayload>('FETCH REPO TREE');
export const fetchRepoTreeSuccess = createAction<FileTree>('FETCH REPO TREE SUCCESS');
export const fetchRepoTreeFailed = createAction<Error>('FETCH REPO TREE FAILED');
export const closeTreePath = createAction<string>('CLOSE TREE PATH');
export const openTreePath = createAction<string>('OPEN TREE PATH');

export const fetchRepoBranches = createAction<FetchRepoPayload>('FETCH REPO BRANCHES');
export const fetchRepoBranchesSuccess = createAction<ReferenceInfo[]>(
  'FETCH REPO BRANCHES SUCCESS'
);
export const fetchRepoBranchesFailed = createAction<Error>('FETCH REPO BRANCHES FAILED');
export const fetchRepoCommits = createAction<FetchRepoPayloadWithRevision>('FETCH REPO COMMITS');
export const fetchRepoCommitsSuccess = createAction<CommitInfo[]>('FETCH REPO COMMITS SUCCESS');
export const fetchRepoCommitsFailed = createAction<Error>('FETCH REPO COMMITS FAILED');

export const fetchFile = createAction<FetchFilePayload>('FETCH FILE');
export const fetchFileSuccess = createAction<FetchFileResponse>('FETCH FILE SUCCESS');
export const fetchFileFailed = createAction<Error>('FETCH FILE ERROR');

export const fetchDirectory = createAction<FetchRepoTreePayload>('FETCH REPO DIR');
export const fetchDirectorySuccess = createAction<FileTree>('FETCH REPO DIR SUCCESS');
export const fetchDirectoryFaile = createAction<Error>('FETCH REPO DIR FAILED');
