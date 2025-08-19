import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const tendersSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    category: { 
      type: String, 
      enum: ['construction', 'it infrastructure', 'agriculture', 'healthcare','education'], 
      required: true 
    },
    budget: {
        type: Number,
    },
    deadline:Date,
    status:{
      type:String,
      enum:['open','closed'],
      default:'open'
    },
    createdBy:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    city:{
      type:String,
      require:true
    },
    attachments: [
      { type: Schema.Types.ObjectId, ref: 'Document', required: true }
    ],
  },{timestamps:true});

tendersSchema.plugin(mongooseAggregatePaginate);  

export const Tender = mongoose.model("Tender" ,tendersSchema);

