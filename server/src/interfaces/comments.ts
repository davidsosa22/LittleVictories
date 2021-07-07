export interface AddCommentReqBody {
  user_id: string;
  task_id: number;
  content: string;
}

export interface RemoveCommentReqParams {
  id: string;
}
