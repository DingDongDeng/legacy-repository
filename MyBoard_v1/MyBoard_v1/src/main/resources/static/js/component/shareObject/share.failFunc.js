export default {
    failFunc(err){
        console.log(err);
        err.data.errorContent.forEach(function(item, index, array){
            alert(item.message);
        })
    }
}