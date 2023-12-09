console.log('pinguinul futacios');

function add(a,b) {
    return a+b
}

console.log(add(1,2))
function dividingNumbers(a,b)
{
    if(b!=0)
    {
        return a/b;
    }else if ( a!=0 )
    {
        return b/a
    }else{
        throw new Error("Impossible. Try again with different numberes!");
    }
        
}
