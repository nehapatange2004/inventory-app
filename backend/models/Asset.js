import mongoose from 'mongoose';

const { Schema } = mongoose;

const AssetSchema = new Schema({
    // ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true }, // filename from the uploader
    storedName: { type: String, required: true },   // name on server/cloud
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },         // bytes
    path: { type: String, required: true },         // disk or cloud path
    // isPublic: { type: Boolean, default: false },    // public access toggle
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Asset', AssetSchema);
