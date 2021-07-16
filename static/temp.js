// event trigger for next and prev button
$("#prevImage").click(function(){
    // see last image corner case later
    var prevIndex = currentImageDataIndex -1;
    var targetKey = globalData[prevIndex].querySelector(".original").id;
    console.log("prevIndex",prevIndex,targetKey);
    if (listDataDict[targetKey]["approvedStatus"]){
      document.getElementById("approveAlert").style.display = "block";
    }
    else{
      document.getElementById("approveAlert").style.display = "none";
    }
    currentImageDataIndex-=1;
    if ((prevIndex > 0) && (prevIndex <= globalData.length-1)){
      var targetElement = globalData[prevIndex];
      var targetImg = targetElement.querySelector(".original");
      console.log("targetElement prev",targetImg);
      targetImg.setAttribute('crossOrigin', 'anonymous');
      var imgId = targetImg.id;
      resizeImageCallback(targetImg,function(){
        var resizedParams = resizeImage(targetImg);
        var target = document.getElementById("file-image");
        target.src = resizedParams[0];
        listDataDict[imgId]["crop_dict"]["resizedWidth"] = resizedParams[1];
        listDataDict[imgId]["crop_dict"]["resizedHeight"] = resizedParams[2];

        editFile();
      });
    }
    else{
      console.log("Not valid or item list ended",this)
    }
    history.deleteHistoryExceptlast(targetKey);

  })
  $("#nextImage").click(function(){
    // see last image corner case later
    var nextIndex = currentImageDataIndex +1;
    var targetKey = globalData[nextIndex].querySelector(".original").id;
    console.log("nextIndex",nextIndex,targetKey);
    if (listDataDict[targetKey]["approvedStatus"]){
      document.getElementById("approveAlert").style.display = "block";
    }
    else{
      document.getElementById("approveAlert").style.display = "none";
    }
    currentImageDataIndex+=1;
    if ((nextIndex >= 0) && (nextIndex < globalData.length-1 )){
      var targetElement = globalData[nextIndex];
      var targetImg = targetElement.querySelector(".original");
      console.log("targetElement next",targetImg);
      targetImg.setAttribute('crossOrigin', 'anonymous');
      var imgId = targetImg.id;
      resizeImageCallback(targetImg,function(){
        var resizedParams = resizeImage(targetImg);
        var target = document.getElementById("file-image");
        target.src = resizedParams[0];
        listDataDict[imgId]["crop_dict"]["resizedWidth"] = resizedParams[1];
        listDataDict[imgId]["crop_dict"]["resizedHeight"] = resizedParams[2];

        editFile();
      });
    }
    else{
      console.log("Not valid or item list ended",this)
    }
    history.deleteHistoryExceptlast(targetKey);
  });