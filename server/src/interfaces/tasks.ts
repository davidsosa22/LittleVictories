import { LikeInstance } from '../database/models/like';

export interface AddTaskReqBody {
  user_id: string;
  description: string;
  due_date: Date;
  minutes_to_complete: number;
  is_important: boolean;
  list_id: number;
}

export interface TaskReqParams {
  id: string;
}

export interface MappedComment {
  id: number;
  content: string;
  user_id: string;
  username: string;
}

export interface FormattedTask {
  id: number;
  username: string;
  description: string;
  completed_at: Date;
  likes: LikeInstance[];
  comments: MappedComment[];
}
