sap.ui.define([], function () {
	"use strict";
	return {
		fnDetermineIcon: function (iValue, sTransit) {
             if(iValue > 0 ) 
             return "sap-icon://message-success";
             else if(iValue < 1 && sTransit === true)
             return "sap-icon://history";
             else 
               return "sap-icon://message-error";
		},
        fnDetermineColor: function (iValue, sTransit) {
            if(iValue > 50 ) 
            return "#00FF00";
            else if(iValue >= 1 && iValue <= 50)
            return "#FFA500";
            else if(iValue < 1 && sTransit === true)
              return "#FF0000";
            else 
              return "#808080";
       },
       fnDetermineTooltip: function (iValue, sTransit) {
        if(iValue > 50 ) 
        return "Good stock";
        else if(iValue >= 1 && iValue <= 50)
        return "Low stock";
        else if(iValue < 1 && sTransit === true)
          return "No stock and has in-transit";
        else 
          return "No stock and no ETA";
   }
	};
});