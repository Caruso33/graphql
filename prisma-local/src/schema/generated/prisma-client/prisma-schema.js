module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.23.0-test.3). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateComment {
  count: Int!
}

type AggregateQueue {
  count: Int!
}

type AggregateSlip {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Comment {
  id: ID!
  title: String!
  body: String!
  queue: Queue!
  author: User!
}

type CommentConnection {
  pageInfo: PageInfo!
  edges: [CommentEdge]!
  aggregate: AggregateComment!
}

input CommentCreateInput {
  id: ID
  title: String!
  body: String!
  queue: QueueCreateOneWithoutCommentsInput!
  author: UserCreateOneWithoutCommentsInput!
}

input CommentCreateManyWithoutAuthorInput {
  create: [CommentCreateWithoutAuthorInput!]
  connect: [CommentWhereUniqueInput!]
}

input CommentCreateManyWithoutQueueInput {
  create: [CommentCreateWithoutQueueInput!]
  connect: [CommentWhereUniqueInput!]
}

input CommentCreateWithoutAuthorInput {
  id: ID
  title: String!
  body: String!
  queue: QueueCreateOneWithoutCommentsInput!
}

input CommentCreateWithoutQueueInput {
  id: ID
  title: String!
  body: String!
  author: UserCreateOneWithoutCommentsInput!
}

type CommentEdge {
  node: Comment!
  cursor: String!
}

enum CommentOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  body_ASC
  body_DESC
}

type CommentPreviousValues {
  id: ID!
  title: String!
  body: String!
}

input CommentScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  body: String
  body_not: String
  body_in: [String!]
  body_not_in: [String!]
  body_lt: String
  body_lte: String
  body_gt: String
  body_gte: String
  body_contains: String
  body_not_contains: String
  body_starts_with: String
  body_not_starts_with: String
  body_ends_with: String
  body_not_ends_with: String
  AND: [CommentScalarWhereInput!]
  OR: [CommentScalarWhereInput!]
  NOT: [CommentScalarWhereInput!]
}

type CommentSubscriptionPayload {
  mutation: MutationType!
  node: Comment
  updatedFields: [String!]
  previousValues: CommentPreviousValues
}

input CommentSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CommentWhereInput
  AND: [CommentSubscriptionWhereInput!]
  OR: [CommentSubscriptionWhereInput!]
  NOT: [CommentSubscriptionWhereInput!]
}

input CommentUpdateInput {
  title: String
  body: String
  queue: QueueUpdateOneRequiredWithoutCommentsInput
  author: UserUpdateOneRequiredWithoutCommentsInput
}

input CommentUpdateManyDataInput {
  title: String
  body: String
}

input CommentUpdateManyMutationInput {
  title: String
  body: String
}

input CommentUpdateManyWithoutAuthorInput {
  create: [CommentCreateWithoutAuthorInput!]
  delete: [CommentWhereUniqueInput!]
  connect: [CommentWhereUniqueInput!]
  set: [CommentWhereUniqueInput!]
  disconnect: [CommentWhereUniqueInput!]
  update: [CommentUpdateWithWhereUniqueWithoutAuthorInput!]
  upsert: [CommentUpsertWithWhereUniqueWithoutAuthorInput!]
  deleteMany: [CommentScalarWhereInput!]
  updateMany: [CommentUpdateManyWithWhereNestedInput!]
}

input CommentUpdateManyWithoutQueueInput {
  create: [CommentCreateWithoutQueueInput!]
  delete: [CommentWhereUniqueInput!]
  connect: [CommentWhereUniqueInput!]
  set: [CommentWhereUniqueInput!]
  disconnect: [CommentWhereUniqueInput!]
  update: [CommentUpdateWithWhereUniqueWithoutQueueInput!]
  upsert: [CommentUpsertWithWhereUniqueWithoutQueueInput!]
  deleteMany: [CommentScalarWhereInput!]
  updateMany: [CommentUpdateManyWithWhereNestedInput!]
}

input CommentUpdateManyWithWhereNestedInput {
  where: CommentScalarWhereInput!
  data: CommentUpdateManyDataInput!
}

input CommentUpdateWithoutAuthorDataInput {
  title: String
  body: String
  queue: QueueUpdateOneRequiredWithoutCommentsInput
}

input CommentUpdateWithoutQueueDataInput {
  title: String
  body: String
  author: UserUpdateOneRequiredWithoutCommentsInput
}

input CommentUpdateWithWhereUniqueWithoutAuthorInput {
  where: CommentWhereUniqueInput!
  data: CommentUpdateWithoutAuthorDataInput!
}

input CommentUpdateWithWhereUniqueWithoutQueueInput {
  where: CommentWhereUniqueInput!
  data: CommentUpdateWithoutQueueDataInput!
}

input CommentUpsertWithWhereUniqueWithoutAuthorInput {
  where: CommentWhereUniqueInput!
  update: CommentUpdateWithoutAuthorDataInput!
  create: CommentCreateWithoutAuthorInput!
}

input CommentUpsertWithWhereUniqueWithoutQueueInput {
  where: CommentWhereUniqueInput!
  update: CommentUpdateWithoutQueueDataInput!
  create: CommentCreateWithoutQueueInput!
}

input CommentWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  body: String
  body_not: String
  body_in: [String!]
  body_not_in: [String!]
  body_lt: String
  body_lte: String
  body_gt: String
  body_gte: String
  body_contains: String
  body_not_contains: String
  body_starts_with: String
  body_not_starts_with: String
  body_ends_with: String
  body_not_ends_with: String
  queue: QueueWhereInput
  author: UserWhereInput
  AND: [CommentWhereInput!]
  OR: [CommentWhereInput!]
  NOT: [CommentWhereInput!]
}

input CommentWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createComment(data: CommentCreateInput!): Comment!
  updateComment(data: CommentUpdateInput!, where: CommentWhereUniqueInput!): Comment
  updateManyComments(data: CommentUpdateManyMutationInput!, where: CommentWhereInput): BatchPayload!
  upsertComment(where: CommentWhereUniqueInput!, create: CommentCreateInput!, update: CommentUpdateInput!): Comment!
  deleteComment(where: CommentWhereUniqueInput!): Comment
  deleteManyComments(where: CommentWhereInput): BatchPayload!
  createQueue(data: QueueCreateInput!): Queue!
  updateQueue(data: QueueUpdateInput!, where: QueueWhereUniqueInput!): Queue
  updateManyQueues(data: QueueUpdateManyMutationInput!, where: QueueWhereInput): BatchPayload!
  upsertQueue(where: QueueWhereUniqueInput!, create: QueueCreateInput!, update: QueueUpdateInput!): Queue!
  deleteQueue(where: QueueWhereUniqueInput!): Queue
  deleteManyQueues(where: QueueWhereInput): BatchPayload!
  createSlip(data: SlipCreateInput!): Slip!
  updateSlip(data: SlipUpdateInput!, where: SlipWhereUniqueInput!): Slip
  updateManySlips(data: SlipUpdateManyMutationInput!, where: SlipWhereInput): BatchPayload!
  upsertSlip(where: SlipWhereUniqueInput!, create: SlipCreateInput!, update: SlipUpdateInput!): Slip!
  deleteSlip(where: SlipWhereUniqueInput!): Slip
  deleteManySlips(where: SlipWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

enum ProcessedType {
  WAITING
  PROCESSED
  CANCELLED
}

type Query {
  comment(where: CommentWhereUniqueInput!): Comment
  comments(where: CommentWhereInput, orderBy: CommentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Comment]!
  commentsConnection(where: CommentWhereInput, orderBy: CommentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CommentConnection!
  queue(where: QueueWhereUniqueInput!): Queue
  queues(where: QueueWhereInput, orderBy: QueueOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Queue]!
  queuesConnection(where: QueueWhereInput, orderBy: QueueOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): QueueConnection!
  slip(where: SlipWhereUniqueInput!): Slip
  slips(where: SlipWhereInput, orderBy: SlipOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Slip]!
  slipsConnection(where: SlipWhereInput, orderBy: SlipOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): SlipConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Queue {
  id: ID!
  title: String!
  slips(where: SlipWhereInput, orderBy: SlipOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Slip!]
  comments(where: CommentWhereInput, orderBy: CommentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Comment!]
  status: StatusType!
}

type QueueConnection {
  pageInfo: PageInfo!
  edges: [QueueEdge]!
  aggregate: AggregateQueue!
}

input QueueCreateInput {
  id: ID
  title: String!
  slips: SlipCreateManyWithoutQueueInput
  comments: CommentCreateManyWithoutQueueInput
  status: StatusType!
}

input QueueCreateOneWithoutCommentsInput {
  create: QueueCreateWithoutCommentsInput
  connect: QueueWhereUniqueInput
}

input QueueCreateOneWithoutSlipsInput {
  create: QueueCreateWithoutSlipsInput
  connect: QueueWhereUniqueInput
}

input QueueCreateWithoutCommentsInput {
  id: ID
  title: String!
  slips: SlipCreateManyWithoutQueueInput
  status: StatusType!
}

input QueueCreateWithoutSlipsInput {
  id: ID
  title: String!
  comments: CommentCreateManyWithoutQueueInput
  status: StatusType!
}

type QueueEdge {
  node: Queue!
  cursor: String!
}

enum QueueOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  status_ASC
  status_DESC
}

type QueuePreviousValues {
  id: ID!
  title: String!
  status: StatusType!
}

type QueueSubscriptionPayload {
  mutation: MutationType!
  node: Queue
  updatedFields: [String!]
  previousValues: QueuePreviousValues
}

input QueueSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: QueueWhereInput
  AND: [QueueSubscriptionWhereInput!]
  OR: [QueueSubscriptionWhereInput!]
  NOT: [QueueSubscriptionWhereInput!]
}

input QueueUpdateInput {
  title: String
  slips: SlipUpdateManyWithoutQueueInput
  comments: CommentUpdateManyWithoutQueueInput
  status: StatusType
}

input QueueUpdateManyMutationInput {
  title: String
  status: StatusType
}

input QueueUpdateOneRequiredWithoutCommentsInput {
  create: QueueCreateWithoutCommentsInput
  update: QueueUpdateWithoutCommentsDataInput
  upsert: QueueUpsertWithoutCommentsInput
  connect: QueueWhereUniqueInput
}

input QueueUpdateOneRequiredWithoutSlipsInput {
  create: QueueCreateWithoutSlipsInput
  update: QueueUpdateWithoutSlipsDataInput
  upsert: QueueUpsertWithoutSlipsInput
  connect: QueueWhereUniqueInput
}

input QueueUpdateWithoutCommentsDataInput {
  title: String
  slips: SlipUpdateManyWithoutQueueInput
  status: StatusType
}

input QueueUpdateWithoutSlipsDataInput {
  title: String
  comments: CommentUpdateManyWithoutQueueInput
  status: StatusType
}

input QueueUpsertWithoutCommentsInput {
  update: QueueUpdateWithoutCommentsDataInput!
  create: QueueCreateWithoutCommentsInput!
}

input QueueUpsertWithoutSlipsInput {
  update: QueueUpdateWithoutSlipsDataInput!
  create: QueueCreateWithoutSlipsInput!
}

input QueueWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  slips_every: SlipWhereInput
  slips_some: SlipWhereInput
  slips_none: SlipWhereInput
  comments_every: CommentWhereInput
  comments_some: CommentWhereInput
  comments_none: CommentWhereInput
  status: StatusType
  status_not: StatusType
  status_in: [StatusType!]
  status_not_in: [StatusType!]
  AND: [QueueWhereInput!]
  OR: [QueueWhereInput!]
  NOT: [QueueWhereInput!]
}

input QueueWhereUniqueInput {
  id: ID
  title: String
}

type Slip {
  id: ID!
  processed: ProcessedType!
  queue: Queue!
  user: User!
}

type SlipConnection {
  pageInfo: PageInfo!
  edges: [SlipEdge]!
  aggregate: AggregateSlip!
}

input SlipCreateInput {
  id: ID
  processed: ProcessedType!
  queue: QueueCreateOneWithoutSlipsInput!
  user: UserCreateOneWithoutSlipsInput!
}

input SlipCreateManyWithoutQueueInput {
  create: [SlipCreateWithoutQueueInput!]
  connect: [SlipWhereUniqueInput!]
}

input SlipCreateManyWithoutUserInput {
  create: [SlipCreateWithoutUserInput!]
  connect: [SlipWhereUniqueInput!]
}

input SlipCreateWithoutQueueInput {
  id: ID
  processed: ProcessedType!
  user: UserCreateOneWithoutSlipsInput!
}

input SlipCreateWithoutUserInput {
  id: ID
  processed: ProcessedType!
  queue: QueueCreateOneWithoutSlipsInput!
}

type SlipEdge {
  node: Slip!
  cursor: String!
}

enum SlipOrderByInput {
  id_ASC
  id_DESC
  processed_ASC
  processed_DESC
}

type SlipPreviousValues {
  id: ID!
  processed: ProcessedType!
}

input SlipScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  processed: ProcessedType
  processed_not: ProcessedType
  processed_in: [ProcessedType!]
  processed_not_in: [ProcessedType!]
  AND: [SlipScalarWhereInput!]
  OR: [SlipScalarWhereInput!]
  NOT: [SlipScalarWhereInput!]
}

type SlipSubscriptionPayload {
  mutation: MutationType!
  node: Slip
  updatedFields: [String!]
  previousValues: SlipPreviousValues
}

input SlipSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: SlipWhereInput
  AND: [SlipSubscriptionWhereInput!]
  OR: [SlipSubscriptionWhereInput!]
  NOT: [SlipSubscriptionWhereInput!]
}

input SlipUpdateInput {
  processed: ProcessedType
  queue: QueueUpdateOneRequiredWithoutSlipsInput
  user: UserUpdateOneRequiredWithoutSlipsInput
}

input SlipUpdateManyDataInput {
  processed: ProcessedType
}

input SlipUpdateManyMutationInput {
  processed: ProcessedType
}

input SlipUpdateManyWithoutQueueInput {
  create: [SlipCreateWithoutQueueInput!]
  delete: [SlipWhereUniqueInput!]
  connect: [SlipWhereUniqueInput!]
  set: [SlipWhereUniqueInput!]
  disconnect: [SlipWhereUniqueInput!]
  update: [SlipUpdateWithWhereUniqueWithoutQueueInput!]
  upsert: [SlipUpsertWithWhereUniqueWithoutQueueInput!]
  deleteMany: [SlipScalarWhereInput!]
  updateMany: [SlipUpdateManyWithWhereNestedInput!]
}

input SlipUpdateManyWithoutUserInput {
  create: [SlipCreateWithoutUserInput!]
  delete: [SlipWhereUniqueInput!]
  connect: [SlipWhereUniqueInput!]
  set: [SlipWhereUniqueInput!]
  disconnect: [SlipWhereUniqueInput!]
  update: [SlipUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [SlipUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [SlipScalarWhereInput!]
  updateMany: [SlipUpdateManyWithWhereNestedInput!]
}

input SlipUpdateManyWithWhereNestedInput {
  where: SlipScalarWhereInput!
  data: SlipUpdateManyDataInput!
}

input SlipUpdateWithoutQueueDataInput {
  processed: ProcessedType
  user: UserUpdateOneRequiredWithoutSlipsInput
}

input SlipUpdateWithoutUserDataInput {
  processed: ProcessedType
  queue: QueueUpdateOneRequiredWithoutSlipsInput
}

input SlipUpdateWithWhereUniqueWithoutQueueInput {
  where: SlipWhereUniqueInput!
  data: SlipUpdateWithoutQueueDataInput!
}

input SlipUpdateWithWhereUniqueWithoutUserInput {
  where: SlipWhereUniqueInput!
  data: SlipUpdateWithoutUserDataInput!
}

input SlipUpsertWithWhereUniqueWithoutQueueInput {
  where: SlipWhereUniqueInput!
  update: SlipUpdateWithoutQueueDataInput!
  create: SlipCreateWithoutQueueInput!
}

input SlipUpsertWithWhereUniqueWithoutUserInput {
  where: SlipWhereUniqueInput!
  update: SlipUpdateWithoutUserDataInput!
  create: SlipCreateWithoutUserInput!
}

input SlipWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  processed: ProcessedType
  processed_not: ProcessedType
  processed_in: [ProcessedType!]
  processed_not_in: [ProcessedType!]
  queue: QueueWhereInput
  user: UserWhereInput
  AND: [SlipWhereInput!]
  OR: [SlipWhereInput!]
  NOT: [SlipWhereInput!]
}

input SlipWhereUniqueInput {
  id: ID
}

enum StatusType {
  ACTIVE
  DEACTIVE
}

type Subscription {
  comment(where: CommentSubscriptionWhereInput): CommentSubscriptionPayload
  queue(where: QueueSubscriptionWhereInput): QueueSubscriptionPayload
  slip(where: SlipSubscriptionWhereInput): SlipSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  comments(where: CommentWhereInput, orderBy: CommentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Comment!]
  slips(where: SlipWhereInput, orderBy: SlipOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Slip!]
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  name: String!
  email: String!
  password: String!
  comments: CommentCreateManyWithoutAuthorInput
  slips: SlipCreateManyWithoutUserInput
}

input UserCreateOneWithoutCommentsInput {
  create: UserCreateWithoutCommentsInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutSlipsInput {
  create: UserCreateWithoutSlipsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutCommentsInput {
  id: ID
  name: String!
  email: String!
  password: String!
  slips: SlipCreateManyWithoutUserInput
}

input UserCreateWithoutSlipsInput {
  id: ID
  name: String!
  email: String!
  password: String!
  comments: CommentCreateManyWithoutAuthorInput
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
}

type UserPreviousValues {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  name: String
  email: String
  password: String
  comments: CommentUpdateManyWithoutAuthorInput
  slips: SlipUpdateManyWithoutUserInput
}

input UserUpdateManyMutationInput {
  name: String
  email: String
  password: String
}

input UserUpdateOneRequiredWithoutCommentsInput {
  create: UserCreateWithoutCommentsInput
  update: UserUpdateWithoutCommentsDataInput
  upsert: UserUpsertWithoutCommentsInput
  connect: UserWhereUniqueInput
}

input UserUpdateOneRequiredWithoutSlipsInput {
  create: UserCreateWithoutSlipsInput
  update: UserUpdateWithoutSlipsDataInput
  upsert: UserUpsertWithoutSlipsInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutCommentsDataInput {
  name: String
  email: String
  password: String
  slips: SlipUpdateManyWithoutUserInput
}

input UserUpdateWithoutSlipsDataInput {
  name: String
  email: String
  password: String
  comments: CommentUpdateManyWithoutAuthorInput
}

input UserUpsertWithoutCommentsInput {
  update: UserUpdateWithoutCommentsDataInput!
  create: UserCreateWithoutCommentsInput!
}

input UserUpsertWithoutSlipsInput {
  update: UserUpdateWithoutSlipsDataInput!
  create: UserCreateWithoutSlipsInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  comments_every: CommentWhereInput
  comments_some: CommentWhereInput
  comments_none: CommentWhereInput
  slips_every: SlipWhereInput
  slips_some: SlipWhereInput
  slips_none: SlipWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    