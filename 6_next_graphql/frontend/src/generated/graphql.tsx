import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  queues: Array<Queue>;
  queue?: Maybe<Queue>;
  users: Array<User>;
  user?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryQueuesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryQueueArgs = {
  id: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type Queue = {
  __typename?: 'Queue';
  id: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  slips?: Maybe<Array<Slip>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Slip = {
  __typename?: 'Slip';
  id: Scalars['Int'];
  processed: Scalars['Boolean'];
  initialQueueSize: Scalars['Float'];
  userId: Scalars['Float'];
  queue: Queue;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  username: Scalars['String'];
  slips?: Maybe<Array<Slip>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createQueue: Queue;
  updateQueue?: Maybe<Queue>;
  deleteQueue: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changeForgotPassword: UserResponse;
};


export type MutationCreateQueueArgs = {
  options: QueueInput;
};


export type MutationUpdateQueueArgs = {
  title?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationDeleteQueueArgs = {
  id: Scalars['Float'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangeForgotPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type QueueInput = {
  title: Scalars['String'];
  description: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularQueueFragment = (
  { __typename?: 'Queue' }
  & Pick<Queue, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description'>
  & { slips?: Maybe<Array<(
    { __typename?: 'Slip' }
    & Pick<Slip, 'id' | 'processed'>
  )>> }
);

export type RegularSlipFragment = (
  { __typename?: 'Slip' }
  & Pick<Slip, 'id' | 'createdAt' | 'updatedAt' | 'processed' | 'userId'>
  & { queue: (
    { __typename?: 'Queue' }
    & Pick<Queue, 'id' | 'title'>
  ) }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ChangeForgotPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangeForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { changeForgotPassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreateQueueMutationVariables = Exact<{
  options: QueueInput;
}>;


export type CreateQueueMutation = (
  { __typename?: 'Mutation' }
  & { createQueue: (
    { __typename?: 'Queue' }
    & RegularQueueFragment
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type QueuesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type QueuesQuery = (
  { __typename?: 'Query' }
  & { queues: Array<(
    { __typename?: 'Queue' }
    & RegularQueueFragment
  )> }
);

export type QueueQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type QueueQuery = (
  { __typename?: 'Query' }
  & { queue?: Maybe<(
    { __typename?: 'Queue' }
    & RegularQueueFragment
  )> }
);

export const RegularQueueFragmentDoc = gql`
    fragment RegularQueue on Queue {
  id
  createdAt
  updatedAt
  title
  description
  slips {
    id
    processed
  }
}
    `;
export const RegularSlipFragmentDoc = gql`
    fragment RegularSlip on Slip {
  id
  createdAt
  updatedAt
  processed
  userId
  queue {
    id
    title
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangeForgotPasswordDocument = gql`
    mutation ChangeForgotPassword($token: String!, $newPassword: String!) {
  changeForgotPassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangeForgotPasswordMutation() {
  return Urql.useMutation<ChangeForgotPasswordMutation, ChangeForgotPasswordMutationVariables>(ChangeForgotPasswordDocument);
};
export const CreateQueueDocument = gql`
    mutation CreateQueue($options: QueueInput!) {
  createQueue(options: $options) {
    ...RegularQueue
  }
}
    ${RegularQueueFragmentDoc}`;

export function useCreateQueueMutation() {
  return Urql.useMutation<CreateQueueMutation, CreateQueueMutationVariables>(CreateQueueDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const QueuesDocument = gql`
    query Queues($limit: Int!, $cursor: String) {
  queues(limit: $limit, cursor: $cursor) {
    ...RegularQueue
  }
}
    ${RegularQueueFragmentDoc}`;

export function useQueuesQuery(options: Omit<Urql.UseQueryArgs<QueuesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueuesQuery>({ query: QueuesDocument, ...options });
};
export const QueueDocument = gql`
    query Queue($id: Int!) {
  queue(id: $id) {
    ...RegularQueue
  }
}
    ${RegularQueueFragmentDoc}`;

export function useQueueQuery(options: Omit<Urql.UseQueryArgs<QueueQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueueQuery>({ query: QueueDocument, ...options });
};