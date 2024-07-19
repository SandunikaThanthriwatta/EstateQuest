import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://www.google.com/imgres?q=user&imgurl=https%3A%2F%2Fas2.ftcdn.net%2Fv2%2Fjpg%2F03%2F49%2F49%2F79%2F1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg&imgrefurl=https%3A%2F%2Fstock.adobe.com%2Fimages%2Fdefault-avatar-profile-icon-vector-social-media-user-photo%2F349497933&docid=dWZmqAWhvxiodM&tbnid=zwbivrqjxgBQGM&vet=12ahUKEwim4ZrW5LOHAxUjyjgGHf4CAKsQM3oECBgQAA..i&w=1000&h=1000&hcb=2&ved=2ahUKEwim4ZrW5LOHAxUjyjgGHf4CAKsQM3oECBgQAA",
    },
    },{timestamps:true}
);

const User=mongoose.model('User',userSchema);

export default User;