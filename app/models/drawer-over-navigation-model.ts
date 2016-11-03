import { EventData, Observable } from "data/observable"
import { Button } from "ui/button";
import { DatePicker } from "ui/date-picker";
import drawerModule = require("nativescript-telerik-ui/sidedrawer");
import frameModule = require("ui/frame");

import * as application from "application";

export class DrawerOverNavigationModel extends Observable {

    get exampleText() {
        return "This app will be your mobile space portal!" +
            " Over hundreds of thousands of photos from Mars the Deep Space." + 
            " + Asteroids to Earth proximity checker";
    }

    get apodDescription() {
        return "Astronomical \nPhoto \nof the Day";
    }

    get roversDescription() {
        return "Mars \nRovers \nPhotos";
    }

    get asteroidsDescription() {
        return "Asteroids \nProximity \nChecker";
    }

    public toggleDrawer() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        sideDrawer.toggleDrawerState();
    }


    public goToHome() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        if (sideDrawer.getIsOpen()) {
            sideDrawer.closeDrawer();
        }
    }

    public goToRoversSelectionPage() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        if (sideDrawer.getIsOpen()) {
            sideDrawer.closeDrawer();
        }

        frameModule.topmost().navigate({
            moduleName: "./views/rovers/rovers-selection",
            animated: true,
            transition: {
                name: application.android ? "explode" : "curl"
            }
        });
    }

    public goToApod() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        if (sideDrawer.getIsOpen()) {
            sideDrawer.closeDrawer();
        }

        frameModule.topmost().navigate({
            moduleName: "./views/apod/apod",
            animated: true,
            transition: {
                name: application.android ? "explode" : "curl"
            }
        });
    }

    public goToAsteroids() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        if (sideDrawer.getIsOpen()) {
            sideDrawer.closeDrawer();
        }

        frameModule.topmost().navigate({
            moduleName: "./views/asteroid/asteroid",
            animated: true,
            transition: {
                name: application.android ? "explode" : "curl"
            }
        });
    }    

    public goToEpic() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        if (sideDrawer.getIsOpen()) {
            sideDrawer.closeDrawer();
        }

        frameModule.topmost().navigate({
            moduleName: "./views/epic/epic",
            animated: true,
            transition: {
                name: application.android ? "explode" : "curl"
            }
        });
    }

    public goToAbout() {
        var sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("sideDrawer"));
        if (sideDrawer.getIsOpen()) {
            sideDrawer.closeDrawer();
        }

        frameModule.topmost().navigate({
            moduleName: "./views/about/about",
            animated: true,
            transition: {
                name: application.android ? "explode" : "curl"
            }
        });
    }  
}