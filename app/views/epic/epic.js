"use strict";
var application = require("application");
var enums = require("ui/enums");
var fileSystem = require("file-system");
var imageSource = require("image-source");
var utils = require("utils/utils");
var SocialShare = require("nativescript-social-share");
if (application.android) {
    var toast = require("nativescript-toast");
}
var epic_model_1 = require("../../view-models/epic/epic-model");
var epicViewModel = new epic_model_1.EpicViewModel();
var page;
var shareButton;
var saveButton;
var desktopButton;
var iosImage;
var currentImage;
var currentSavedPath;
function onPageLoaded(args) {
    page = args.object;
}
exports.onPageLoaded = onPageLoaded;
function onScrollSwipe(args) {
    // if (args.direction === 1) {
    //     previousDate();
    // } else if (args.direction === 2) {
    //     nextDate();
    // }   
}
exports.onScrollSwipe = onScrollSwipe;
function onPageNavigatedTo(args) {
    page = args.object;
    var pageContainer = page.getViewById("pageContainer");
    shareButton = page.getViewById("btn-share");
    saveButton = page.getViewById("btn-save");
    desktopButton = page.getViewById("btn-desk");
    if (application.android) {
        setButtonsOpacity(0.2);
        setUserInteraction(false);
    }
    if (application.ios) {
        iosImage = page.getViewById("ios-image");
    }
    if (!epicViewModel.get("dataItem")) {
        epicViewModel.initDataItems();
    }
    pageContainer.bindingContext = epicViewModel;
}
exports.onPageNavigatedTo = onPageNavigatedTo;
function onSaveImage(args) {
    if (application.ios) {
        imageSource.fromUrl(iosImage.src)
            .then(function (res) {
            saveFile(res);
        }).catch(function (err) {
            // console.log(err.stack);
        });
    }
    else if (application.android) {
        saveFile(currentImage);
        toast.makeText("Photo saved in /Downloads/CosmosDataBank/").show();
    }
}
exports.onSaveImage = onSaveImage;
function onSetWallpaper(args) {
    if (application.ios) {
        imageSource.fromUrl(iosImage.src)
            .then(function (res) {
            currentImage = res; // TODO : set wallpaper for iOS
        }).catch(function (err) {
            // console.log(err.stack);
        });
        ;
    }
    else if (application.android) {
        saveFile(currentImage);
        var wallpaperManager = android.app.WallpaperManager.getInstance(utils.ad.getApplicationContext());
        try {
            var imageToSet = imageSource.fromFile(currentSavedPath);
            wallpaperManager.setBitmap(imageToSet.android);
        }
        catch (error) {
        }
        toast.makeText("Wallpaper Set!").show();
    }
}
exports.onSetWallpaper = onSetWallpaper;
function onShare(args) {
    if (application.android) {
        SocialShare.shareImage(currentImage, "NASA EPIC");
    }
    else if (application.ios) {
        imageSource.fromUrl(iosImage.src)
            .then(function (res) {
            SocialShare.shareImage(res);
        }).catch(function (err) {
            // console.log(err.stack);
        });
    }
}
exports.onShare = onShare;
function previousDate() {
    // if (application.android) {
    //     setButtonsOpacity(0.2);
    //     setUserInteraction(false);
    // }
    // // TODO: add check if the date is not too far in the past (check first EPIC date)
    // var currentDate = epicViewModel.get("selectedDate");
    // currentDate.setDate(currentDate.getDate()-1);
    // epicViewModel.set("selectedDate", currentDate);
    // epicViewModel.initDataItems(); 
}
exports.previousDate = previousDate;
function nextDate() {
    // if (application.android) {
    //     setButtonsOpacity(0.2);
    //     setUserInteraction(false);
    // }
    // var currentDate = epicViewModel.get("selectedDate");
    // if (currentDate >= new Date()) {
    //     if (application.android) {
    //         toast.makeText("Can not load photos from future!").show();
    //     }
    // } else {
    //     currentDate.setDate(currentDate.getDate()+1);
    //     epicViewModel.set("selectedDate", currentDate);
    //     epicViewModel.initDataItems(); 
    // }
}
exports.nextDate = nextDate;
function onSubmit(args) {
    console.log("on submit ");
}
exports.onSubmit = onSubmit;
function onFinalImageSet(args) {
    var drawee = args.object;
    imageSource.fromUrl(drawee.imageUri)
        .then(function (res) {
        currentImage = res;
        saveButton.animate({ opacity: 0.2, rotate: 360 })
            .then(function (resu) { return saveButton.animate({ opacity: 0.5, rotate: 180, duration: 150 }); })
            .then(function (resul) { return saveButton.animate({ opacity: 1.0, rotate: 0, duration: 150 }); });
        desktopButton.animate({ opacity: 0.2, rotate: 360 })
            .then(function (resu) { return desktopButton.animate({ opacity: 0.5, rotate: 180, duration: 150 }); })
            .then(function (resul) { return desktopButton.animate({ opacity: 1.0, rotate: 0, duration: 150 }); });
        shareButton.animate({ opacity: 0.2, rotate: 360 })
            .then(function (resu) { return shareButton.animate({ opacity: 0.5, rotate: 180, duration: 150 }); })
            .then(function (resul) { return shareButton.animate({ opacity: 1.0, rotate: 0, duration: 150 }); });
        setUserInteraction(true);
    }).catch(function (err) {
        // console.log(err.stack);
    });
}
exports.onFinalImageSet = onFinalImageSet;
function saveFile(res) {
    var url = epicViewModel.get("dataItem").url;
    var fileName = url.substring(url.lastIndexOf("/") + 1);
    var n = fileName.indexOf(".");
    fileName = fileName.substring(0, n !== -1 ? n : fileName.length) + ".jpeg";
    if (application.android) {
        // tslint:disable-next-line:max-line-length
        var androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString();
        var cosmosFolderPath = fileSystem.path.join(androidDownloadsPath, "CosmosDataBank");
    }
    else if (application.ios) {
        // TODO :  this works - but where are the images ?
        var iosDownloadPath = fileSystem.knownFolders.documents();
        // tslint:disable-next-line:no-shadowed-variable
        var cosmosFolderPath = fileSystem.path.join(iosDownloadPath.path, "CosmosDataBank");
    }
    var folder = fileSystem.Folder.fromPath(cosmosFolderPath);
    var path = fileSystem.path.join(cosmosFolderPath, fileName);
    var exists = fileSystem.File.exists(path);
    if (!exists) {
        var saved = res.saveToFile(path, enums.ImageFormat.jpeg);
    }
    currentSavedPath = path;
}
exports.saveFile = saveFile;
function onIosShare() {
    console.log("iOS share tapped! 1");
    console.log(iosImage.src);
    imageSource.fromUrl(iosImage.src)
        .then(function (res) {
        SocialShare.shareImage(res);
    }).catch(function (err) {
        // console.log(err.sstack);
    });
}
exports.onIosShare = onIosShare;
function formatDate(date) {
    var d = new Date(date), month = "" + (d.getMonth() + 1), day = "" + d.getDate(), year = d.getFullYear();
    if (month.length < 2) {
        month = "0" + month;
    }
    if (day.length < 2) {
        day = "0" + day;
    }
    return [year, month, day].join("-");
}
function setUserInteraction(state) {
    shareButton.isUserInteractionEnabled = state;
    saveButton.isUserInteractionEnabled = state;
    desktopButton.isUserInteractionEnabled = state;
}
function setButtonsOpacity(value) {
    saveButton.opacity = value;
    desktopButton.opacity = value;
    shareButton.opacity = value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVwaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVdBLHlDQUE0QztBQUc1QyxnQ0FBbUM7QUFDbkMsd0NBQTJDO0FBQzNDLDBDQUE2QztBQUU3QyxtQ0FBcUM7QUFJckMsdURBQXlEO0FBRXpELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxnRUFBNEU7QUFDNUUsSUFBSSxhQUFhLEdBQUcsSUFBSSwwQkFBYSxFQUFFLENBQUM7QUFFeEMsSUFBSSxJQUFVLENBQUM7QUFDZixJQUFJLFdBQW1CLENBQUM7QUFDeEIsSUFBSSxVQUFrQixDQUFDO0FBQ3ZCLElBQUksYUFBcUIsQ0FBQztBQUMxQixJQUFJLFFBQWUsQ0FBQztBQUNwQixJQUFJLFlBQXFDLENBQUM7QUFFMUMsSUFBSSxnQkFBd0IsQ0FBQztBQUU3QixzQkFBNkIsSUFBZTtJQUN4QyxJQUFJLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM3QixDQUFDO0FBRkQsb0NBRUM7QUFFRCx1QkFBOEIsSUFBMkI7SUFDckQsOEJBQThCO0lBQzlCLHNCQUFzQjtJQUN0QixxQ0FBcUM7SUFDckMsa0JBQWtCO0lBQ2xCLE9BQU87QUFDWCxDQUFDO0FBTkQsc0NBTUM7QUFFRCwyQkFBa0MsSUFBZTtJQUM3QyxJQUFJLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN6QixJQUFJLGFBQWEsR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVuRSxXQUFXLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRCxVQUFVLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxhQUFhLEdBQVcsSUFBSSxDQUFD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QUFJLElBQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUYsSUFBSSxDQUFDLFVBQUEsS0FBSyxJQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0YsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQy9DLElBQUksQ0FBQyxVQUFBLElBQUksSUFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3RixJQUFJLENBQUMsVUFBQSxLQUFLLElBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7YUFDN0MsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNG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dGEsIFByb3BlcnR5Q2hhbmdlRGF0YSB9IGZyb20gXCJkYXRhL29ic2VydmFibGVcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcInVpL2J1dHRvblwiO1xyXG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gXCJ1aS9pbWFnZVwiO1xyXG5pbXBvcnQgeyBHZXN0dXJlVHlwZXMsIEdlc3R1cmVFdmVudERhdGEsIFN3aXBlR2VzdHVyZUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcclxuaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tIFwidWkvbGlzdC12aWV3XCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBTY3JvbGxWaWV3IH0gZnJvbSBcInVpL3Njcm9sbC12aWV3XCI7XHJcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvc3RhY2stbGF5b3V0XCI7XHJcbmltcG9ydCB7IHRvcG1vc3QgfSBmcm9tIFwidWkvZnJhbWVcIjtcclxuXHJcbmltcG9ydCBhcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCJhcHBsaWNhdGlvblwiKTtcclxuaW1wb3J0IGNvbG9yID0gcmVxdWlyZShcImNvbG9yXCIpO1xyXG5pbXBvcnQgZGlhbG9ncyA9IHJlcXVpcmUoXCJ1aS9kaWFsb2dzXCIpO1xyXG5pbXBvcnQgZW51bXMgPSByZXF1aXJlKFwidWkvZW51bXNcIik7XHJcbmltcG9ydCBmaWxlU3lzdGVtID0gcmVxdWlyZShcImZpbGUtc3lzdGVtXCIpO1xyXG5pbXBvcnQgaW1hZ2VTb3VyY2UgPSByZXF1aXJlKFwiaW1hZ2Utc291cmNlXCIpO1xyXG5pbXBvcnQgcGxhdGZvcm1Nb2R1bGUgPSByZXF1aXJlKFwicGxhdGZvcm1cIik7XHJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCJ1dGlscy91dGlsc1wiO1xyXG5cclxuaW1wb3J0IGRyYXdlck1vZHVsZSA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS9zaWRlZHJhd2VyXCIpO1xyXG5pbXBvcnQgeyBGcmVzY29EcmF3ZWUsIEZpbmFsRXZlbnREYXRhIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1mcmVzY29cIjtcclxuaW1wb3J0ICogYXMgU29jaWFsU2hhcmUgZnJvbSBcIm5hdGl2ZXNjcmlwdC1zb2NpYWwtc2hhcmVcIjtcclxuXHJcbmlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICB2YXIgdG9hc3QgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXRvYXN0XCIpO1xyXG59XHJcblxyXG5pbXBvcnQgeyBFcGljVmlld01vZGVsLCBFcGljSXRlbSB9IGZyb20gXCIuLi8uLi92aWV3LW1vZGVscy9lcGljL2VwaWMtbW9kZWxcIjtcclxubGV0IGVwaWNWaWV3TW9kZWwgPSBuZXcgRXBpY1ZpZXdNb2RlbCgpO1xyXG5cclxubGV0IHBhZ2U6IFBhZ2U7XHJcbmxldCBzaGFyZUJ1dHRvbjogQnV0dG9uO1xyXG5sZXQgc2F2ZUJ1dHRvbjogQnV0dG9uO1xyXG5sZXQgZGVza3RvcEJ1dHRvbjogQnV0dG9uO1xyXG5sZXQgaW9zSW1hZ2U6IEltYWdlO1xyXG5sZXQgY3VycmVudEltYWdlOiBpbWFnZVNvdXJjZS5JbWFnZVNvdXJjZTtcclxuXHJcbnZhciBjdXJyZW50U2F2ZWRQYXRoOiBzdHJpbmc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25QYWdlTG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25TY3JvbGxTd2lwZShhcmdzOiBTd2lwZUdlc3R1cmVFdmVudERhdGEpIHtcclxuICAgIC8vIGlmIChhcmdzLmRpcmVjdGlvbiA9PT0gMSkge1xyXG4gICAgLy8gICAgIHByZXZpb3VzRGF0ZSgpO1xyXG4gICAgLy8gfSBlbHNlIGlmIChhcmdzLmRpcmVjdGlvbiA9PT0gMikge1xyXG4gICAgLy8gICAgIG5leHREYXRlKCk7XHJcbiAgICAvLyB9ICAgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvblBhZ2VOYXZpZ2F0ZWRUbyhhcmdzOiBFdmVudERhdGEpIHtcclxuICAgIHBhZ2UgPSA8UGFnZT5hcmdzLm9iamVjdDtcclxuICAgIHZhciBwYWdlQ29udGFpbmVyID0gPFN0YWNrTGF5b3V0PnBhZ2UuZ2V0Vmlld0J5SWQoXCJwYWdlQ29udGFpbmVyXCIpO1xyXG5cclxuICAgIHNoYXJlQnV0dG9uID0gPEJ1dHRvbj5wYWdlLmdldFZpZXdCeUlkKFwiYnRuLXNoYXJlXCIpO1xyXG4gICAgc2F2ZUJ1dHRvbiA9IDxCdXR0b24+cGFnZS5nZXRWaWV3QnlJZChcImJ0bi1zYXZlXCIpO1xyXG4gICAgZGVza3RvcEJ1dHRvbiA9IDxCdXR0b24+cGFnZS5nZXRWaWV3QnlJZChcImJ0bi1kZXNrXCIpO1xyXG5cclxuICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAgICAgc2V0QnV0dG9uc09wYWNpdHkoMC4yKTtcclxuICAgICAgICBzZXRVc2VySW50ZXJhY3Rpb24oZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcHBsaWNhdGlvbi5pb3MpIHtcclxuICAgICAgICBpb3NJbWFnZSA9IDxJbWFnZT5wYWdlLmdldFZpZXdCeUlkKFwiaW9zLWltYWdlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghZXBpY1ZpZXdNb2RlbC5nZXQoXCJkYXRhSXRlbVwiKSkge1xyXG4gICAgICAgIGVwaWNWaWV3TW9kZWwuaW5pdERhdGFJdGVtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhZ2VDb250YWluZXIuYmluZGluZ0NvbnRleHQgPSBlcGljVmlld01vZGVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25TYXZlSW1hZ2UoYXJnczogRXZlbnREYXRhKSB7XHJcblxyXG4gICAgaWYgKGFwcGxpY2F0aW9uLmlvcykge1xyXG4gICAgICAgIGltYWdlU291cmNlLmZyb21VcmwoaW9zSW1hZ2Uuc3JjKVxyXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUZpbGUocmVzKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAgICAgc2F2ZUZpbGUoY3VycmVudEltYWdlKTtcclxuICAgICAgICB0b2FzdC5tYWtlVGV4dChcIlBob3RvIHNhdmVkIGluIC9Eb3dubG9hZHMvQ29zbW9zRGF0YUJhbmsvXCIpLnNob3coKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uU2V0V2FsbHBhcGVyKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG5cclxuICAgIGlmIChhcHBsaWNhdGlvbi5pb3MpIHtcclxuICAgICAgICBpbWFnZVNvdXJjZS5mcm9tVXJsKGlvc0ltYWdlLnNyYylcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbWFnZSA9IHJlczsgLy8gVE9ETyA6IHNldCB3YWxscGFwZXIgZm9yIGlPU1xyXG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyLnN0YWNrKTtcclxuICAgICAgICAgICAgfSk7IDtcclxuICAgIH0gZWxzZSBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG5cclxuICAgICAgICBzYXZlRmlsZShjdXJyZW50SW1hZ2UpO1xyXG5cclxuICAgICAgICB2YXIgd2FsbHBhcGVyTWFuYWdlciA9IGFuZHJvaWQuYXBwLldhbGxwYXBlck1hbmFnZXIuZ2V0SW5zdGFuY2UodXRpbHMuYWQuZ2V0QXBwbGljYXRpb25Db250ZXh0KCkpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZVRvU2V0ID0gaW1hZ2VTb3VyY2UuZnJvbUZpbGUoY3VycmVudFNhdmVkUGF0aCk7XHJcbiAgICAgICAgICAgIHdhbGxwYXBlck1hbmFnZXIuc2V0Qml0bWFwKGltYWdlVG9TZXQuYW5kcm9pZCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyb3Iuc3RhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9hc3QubWFrZVRleHQoXCJXYWxscGFwZXIgU2V0IVwiKS5zaG93KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvblNoYXJlKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcclxuICAgICAgICBTb2NpYWxTaGFyZS5zaGFyZUltYWdlKGN1cnJlbnRJbWFnZSwgXCJOQVNBIEVQSUNcIik7XHJcbiAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uLmlvcykge1xyXG4gICAgICAgIGltYWdlU291cmNlLmZyb21VcmwoaW9zSW1hZ2Uuc3JjKVxyXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgU29jaWFsU2hhcmUuc2hhcmVJbWFnZShyZXMpO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyLnN0YWNrKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmV2aW91c0RhdGUoKSB7XHJcbiAgICAvLyBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgLy8gICAgIHNldEJ1dHRvbnNPcGFjaXR5KDAuMik7XHJcbiAgICAvLyAgICAgc2V0VXNlckludGVyYWN0aW9uKGZhbHNlKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAvLyBUT0RPOiBhZGQgY2hlY2sgaWYgdGhlIGRhdGUgaXMgbm90IHRvbyBmYXIgaW4gdGhlIHBhc3QgKGNoZWNrIGZpcnN0IEVQSUMgZGF0ZSlcclxuICAgIC8vIHZhciBjdXJyZW50RGF0ZSA9IGVwaWNWaWV3TW9kZWwuZ2V0KFwic2VsZWN0ZWREYXRlXCIpO1xyXG4gICAgLy8gY3VycmVudERhdGUuc2V0RGF0ZShjdXJyZW50RGF0ZS5nZXREYXRlKCktMSk7XHJcbiAgICAvLyBlcGljVmlld01vZGVsLnNldChcInNlbGVjdGVkRGF0ZVwiLCBjdXJyZW50RGF0ZSk7XHJcbiAgICAvLyBlcGljVmlld01vZGVsLmluaXREYXRhSXRlbXMoKTsgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXh0RGF0ZSgpIHtcclxuICAgIC8vIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAvLyAgICAgc2V0QnV0dG9uc09wYWNpdHkoMC4yKTtcclxuICAgIC8vICAgICBzZXRVc2VySW50ZXJhY3Rpb24oZmFsc2UpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHZhciBjdXJyZW50RGF0ZSA9IGVwaWNWaWV3TW9kZWwuZ2V0KFwic2VsZWN0ZWREYXRlXCIpO1xyXG4gICAgLy8gaWYgKGN1cnJlbnREYXRlID49IG5ldyBEYXRlKCkpIHtcclxuICAgIC8vICAgICBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgLy8gICAgICAgICB0b2FzdC5tYWtlVGV4dChcIkNhbiBub3QgbG9hZCBwaG90b3MgZnJvbSBmdXR1cmUhXCIpLnNob3coKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICAgIGN1cnJlbnREYXRlLnNldERhdGUoY3VycmVudERhdGUuZ2V0RGF0ZSgpKzEpO1xyXG4gICAgLy8gICAgIGVwaWNWaWV3TW9kZWwuc2V0KFwic2VsZWN0ZWREYXRlXCIsIGN1cnJlbnREYXRlKTtcclxuICAgIC8vICAgICBlcGljVmlld01vZGVsLmluaXREYXRhSXRlbXMoKTsgXHJcbiAgICAvLyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvblN1Ym1pdChhcmdzOiBFdmVudERhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKFwib24gc3VibWl0IFwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uRmluYWxJbWFnZVNldChhcmdzOiBGaW5hbEV2ZW50RGF0YSkge1xyXG4gICAgdmFyIGRyYXdlZSA9IGFyZ3Mub2JqZWN0IGFzIEZyZXNjb0RyYXdlZTtcclxuXHJcbiAgICBpbWFnZVNvdXJjZS5mcm9tVXJsKGRyYXdlZS5pbWFnZVVyaSlcclxuICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50SW1hZ2UgPSByZXM7XHJcblxyXG4gICAgICAgICAgICBzYXZlQnV0dG9uLmFuaW1hdGUoeyBvcGFjaXR5OiAwLjIsIHJvdGF0ZTogMzYwIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1ID0+IHsgcmV0dXJuIHNhdmVCdXR0b24uYW5pbWF0ZSh7IG9wYWNpdHk6IDAuNSwgcm90YXRlOiAxODAsIGR1cmF0aW9uOiAxNTAgfSk7IH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bCA9PiB7IHJldHVybiBzYXZlQnV0dG9uLmFuaW1hdGUoeyBvcGFjaXR5OiAxLjAsIHJvdGF0ZTogMCwgZHVyYXRpb246IDE1MCB9KTsgfSk7XHJcblxyXG4gICAgICAgICAgICBkZXNrdG9wQnV0dG9uLmFuaW1hdGUoeyBvcGFjaXR5OiAwLjIsIHJvdGF0ZTogMzYwIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1ID0+IHsgcmV0dXJuIGRlc2t0b3BCdXR0b24uYW5pbWF0ZSh7IG9wYWNpdHk6IDAuNSwgcm90YXRlOiAxODAsIGR1cmF0aW9uOiAxNTAgfSk7IH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bCA9PiB7IHJldHVybiBkZXNrdG9wQnV0dG9uLmFuaW1hdGUoeyBvcGFjaXR5OiAxLjAsIHJvdGF0ZTogMCwgZHVyYXRpb246IDE1MCB9KTsgfSk7XHJcblxyXG4gICAgICAgICAgICBzaGFyZUJ1dHRvbi5hbmltYXRlKHsgb3BhY2l0eTogMC4yLCByb3RhdGU6IDM2MCB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdSA9PiB7IHJldHVybiBzaGFyZUJ1dHRvbi5hbmltYXRlKHsgb3BhY2l0eTogMC41LCByb3RhdGU6IDE4MCwgZHVyYXRpb246IDE1MCB9KTsgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsID0+IHsgcmV0dXJuIHNoYXJlQnV0dG9uLmFuaW1hdGUoeyBvcGFjaXR5OiAxLjAsIHJvdGF0ZTogMCwgZHVyYXRpb246IDE1MCB9KTsgfSk7XHJcblxyXG4gICAgICAgICAgICBzZXRVc2VySW50ZXJhY3Rpb24odHJ1ZSk7XHJcblxyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRmlsZShyZXM6IGltYWdlU291cmNlLkltYWdlU291cmNlKSB7XHJcbiAgICB2YXIgdXJsID0gZXBpY1ZpZXdNb2RlbC5nZXQoXCJkYXRhSXRlbVwiKS51cmw7XHJcbiAgICB2YXIgZmlsZU5hbWUgPSB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKTtcclxuICAgIHZhciBuID0gZmlsZU5hbWUuaW5kZXhPZihcIi5cIik7XHJcbiAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZygwLCBuICE9PSAtMSA/IG4gOiBmaWxlTmFtZS5sZW5ndGgpICsgXCIuanBlZ1wiO1xyXG5cclxuICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgIHZhciBhbmRyb2lkRG93bmxvYWRzUGF0aCA9IGFuZHJvaWQub3MuRW52aXJvbm1lbnQuZ2V0RXh0ZXJuYWxTdG9yYWdlUHVibGljRGlyZWN0b3J5KGFuZHJvaWQub3MuRW52aXJvbm1lbnQuRElSRUNUT1JZX0RPV05MT0FEUykudG9TdHJpbmcoKTtcclxuICAgICAgICB2YXIgY29zbW9zRm9sZGVyUGF0aCA9IGZpbGVTeXN0ZW0ucGF0aC5qb2luKGFuZHJvaWREb3dubG9hZHNQYXRoLCBcIkNvc21vc0RhdGFCYW5rXCIpO1xyXG4gICAgfSBlbHNlIGlmIChhcHBsaWNhdGlvbi5pb3MpIHtcclxuICAgICAgICAvLyBUT0RPIDogIHRoaXMgd29ya3MgLSBidXQgd2hlcmUgYXJlIHRoZSBpbWFnZXMgP1xyXG4gICAgICAgIHZhciBpb3NEb3dubG9hZFBhdGggPSBmaWxlU3lzdGVtLmtub3duRm9sZGVycy5kb2N1bWVudHMoKTtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc2hhZG93ZWQtdmFyaWFibGVcclxuICAgICAgICB2YXIgY29zbW9zRm9sZGVyUGF0aCA9IGZpbGVTeXN0ZW0ucGF0aC5qb2luKGlvc0Rvd25sb2FkUGF0aC5wYXRoLCBcIkNvc21vc0RhdGFCYW5rXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBmb2xkZXIgPSBmaWxlU3lzdGVtLkZvbGRlci5mcm9tUGF0aChjb3Ntb3NGb2xkZXJQYXRoKTtcclxuICAgIHZhciBwYXRoID0gZmlsZVN5c3RlbS5wYXRoLmpvaW4oY29zbW9zRm9sZGVyUGF0aCwgZmlsZU5hbWUpO1xyXG4gICAgdmFyIGV4aXN0cyA9IGZpbGVTeXN0ZW0uRmlsZS5leGlzdHMocGF0aCk7XHJcblxyXG4gICAgaWYgKCFleGlzdHMpIHtcclxuICAgICAgICB2YXIgc2F2ZWQgPSByZXMuc2F2ZVRvRmlsZShwYXRoLCBlbnVtcy5JbWFnZUZvcm1hdC5qcGVnKTtcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50U2F2ZWRQYXRoID0gcGF0aDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uSW9zU2hhcmUoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImlPUyBzaGFyZSB0YXBwZWQhIDFcIik7XHJcbiAgICBjb25zb2xlLmxvZyhpb3NJbWFnZS5zcmMpO1xyXG5cclxuICAgIGltYWdlU291cmNlLmZyb21VcmwoaW9zSW1hZ2Uuc3JjKVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgIFNvY2lhbFNoYXJlLnNoYXJlSW1hZ2UocmVzKTtcclxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnIuc3N0YWNrKTtcclxuICAgICAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XHJcbiAgICB2YXIgZCA9IG5ldyBEYXRlKGRhdGUpLFxyXG4gICAgICAgIG1vbnRoID0gXCJcIiArIChkLmdldE1vbnRoKCkgKyAxKSxcclxuICAgICAgICBkYXkgPSBcIlwiICsgZC5nZXREYXRlKCksXHJcbiAgICAgICAgeWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgICBpZiAobW9udGgubGVuZ3RoIDwgMikge1xyXG4gICAgICAgIG1vbnRoID0gXCIwXCIgKyBtb250aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF5Lmxlbmd0aCA8IDIpIHtcclxuICAgICAgICBkYXkgPSBcIjBcIiArIGRheTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gW3llYXIsIG1vbnRoLCBkYXldLmpvaW4oXCItXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRVc2VySW50ZXJhY3Rpb24oc3RhdGU6IGJvb2xlYW4pIHtcclxuICAgIHNoYXJlQnV0dG9uLmlzVXNlckludGVyYWN0aW9uRW5hYmxlZCA9IHN0YXRlO1xyXG4gICAgc2F2ZUJ1dHRvbi5pc1VzZXJJbnRlcmFjdGlvbkVuYWJsZWQgPSBzdGF0ZTtcclxuICAgIGRlc2t0b3BCdXR0b24uaXNVc2VySW50ZXJhY3Rpb25FbmFibGVkID0gc3RhdGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldEJ1dHRvbnNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgIHNhdmVCdXR0b24ub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgZGVza3RvcEJ1dHRvbi5vcGFjaXR5ID0gdmFsdWU7XHJcbiAgICBzaGFyZUJ1dHRvbi5vcGFjaXR5ID0gdmFsdWU7XHJcbn1cclxuIl19