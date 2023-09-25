function cartController(){
    //factory functions
    return{
        //CURD 
        index(req,res){
            res.render('customers/cart')
        }
    }
}

module.exports=cartController