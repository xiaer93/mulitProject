module.exports={

    entry:{
        animation:'./animationBykeyframe/util/index.js',
        riceDumpling:'./riceDumpling/source/js/index.js'
    },
    output:{
        path:__dirname+'/build',
        filename:'[name].js'
    }
};