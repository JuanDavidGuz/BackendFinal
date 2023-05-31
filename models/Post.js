const {Schema, model} = require('mongoose');

const Post = Schema({
    title: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    file:{
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
    },


},{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});

Post.method('toJSON',function(){
    const{__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Post', Post);