function orderController(){
    return{
        store(req,res){
            console.log(req.body)
        }
    }
}

module.exports = orderController