import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    name: { type: String, required: [true,"Name is required"], trim:true },
    email: { type: String, required: [true,"Email is required"], unique: true, index:true},
    password: { type: String, required: [true,"Password is required"] },
    role: {
      type: String,
      enum: [
        'government',         // government account (tender owner)
        'procurement_officer',
        'department_head',
        'finance_officer',
        'legal_advisor',
        'supplier',
        'citizen',
        'admin'
      ],
      default: 'citizen'
    },
    phone: String,
    addresses: [{
      street: String,
      city: String,
      state: String,
      zipCode: String,
      type: { 
        type: String,
        enum: ['office', 'other'],
        default: 'office'
      },
      isDefault: { type: Boolean, default: false }
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    refreshToken:{
      type:String
    }
  },{timestamps:true});


userSchema.pre("save",async function(next){ //Not using arrow function becuase there we can't use this
  if(!this.isModified("password")) return next(); 
  this.password = await bcrypt.hash(this.password,10);
  next();
})

//custom method
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      name:this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User",userSchema);

