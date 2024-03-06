const mongoose= require('mongoose');
const {ObjectId}= mongoose.Schema.Types;
const CustomerReviewSchema= new mongoose.Schema({
    rating:{
        type:String,
        required:true
    },
    comments:{
          type:String,
          required:true
      },
      productId:{
        type:String,
        required:true
    }
      ,author :{ 
          type:ObjectId,
      ref:"UserModel"

}
},{timestamps:true})
module.exports= mongoose.model('customerReview',CustomerReviewSchema);