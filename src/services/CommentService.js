import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export default class CommentService {
    static async createComment(commentData) {
        const comment = await Comment.create(commentData);
        await Post.findByIdAndUpdate(
            commentData.post,
            { $inc: { commentCount: 1 } }
        );
        return this._enrichComment(comment);
    }

    static async getNestedComments(postId, depth = 3) {
        const comments = await Comment.aggregate([
            { $match: { post: postId, parentComment: null } },
            {
                $graphLookup: {
                    from: 'comments',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentComment',
                    as: 'replies',
                    maxDepth: depth - 1
                }
            }
        ]);
        return comments.map(this._enrichComment);
    }

    static _enrichComment(comment) {
        return {
            ...comment,
            hasReplies: comment.replies?.length > 0
        };
    }
}