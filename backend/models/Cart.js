  import mongoose from 'mongoose';

  const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },        // save product name at the time of adding
        image: { type: String },                        // optional image URL
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },       // snapshot price at the time of add
      },
    ],
  }, { timestamps: true });

  export default mongoose.model('Cart', cartSchema);
