//livrable class
//an instance of livrable class will be instantiated when the student decides to create a new project that he will be working on
//the livrable class helps with organizing the project phases ( phase: I - until: 23/10/2023 - todo: frontend - video: uploadation - link of repository: https://gihtub.com)

class Livrable{

    constructor(phaseNo,deliveryDate,comments,video,linkGit)
    {
        this.phaseNo=phaseNo;
        this.deliveryDate=deliveryDate;
        this.comments=comments;
        this.video=video;
        this.linkGit=linkGit;
    }
    
}

export default Livrable;

//check
//Date(year,month,day) - constructor for 00:00:00 creation
// const l1=new Livrable(1,new Date("2023-12-09"),"blablas fas aslf afla flafl ","acaca","hhtps://github/theoretically-andrei.com");
// console.log(l1)

// if(l1.deliveryDate=="Sat Dec 09 2023 02:00:00 GMT+0200 (Eastern European Standard Time)")
// {
//     console.log("Adevarata!");
// }
