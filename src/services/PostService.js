import Post from '../models/Post.js';

export default class PostService {
    static async createPostWithTags(postData) {
        const post = await Post.create(postData);
        await this._updateTagCloud(post.organization);
        return post;
    }

    static async incrementViews(postId) {

        await Post.findByIdAndUpdate(postId, { $inc: { views: 10 } });

        return views;
    }

    static async _updateTagCloud(organizationId) {
        // Implement tag cloud aggregation logic
    }
}