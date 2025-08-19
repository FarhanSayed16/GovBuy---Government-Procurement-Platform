import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import mongoosePaginate      from "mongoose-paginate-v2";

const bidSchema = new mongoose.Schema({
  tender: { type: Schema.Types.ObjectId, ref: 'Tender' },
  supplier: { type: Schema.Types.ObjectId, ref: 'User' },
  bidAmount: { type: Number, required: true },
  proposal: String,
  proposalDoc: { type: Schema.Types.ObjectId, ref: 'Document' , required:true},
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

bidSchema.plugin(mongooseAggregatePaginate);  

bidSchema.plugin(mongoosePaginate);

bidSchema.index({ tender: 1, supplier: 1 }, { unique: true });

export const Bid = mongoose.model("Bid" ,bidSchema);