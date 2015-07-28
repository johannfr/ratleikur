ratleikur
=========

This is a very simple Android/iOS (not tested on iOS) app for basically making a simple geocaching quest.

To edit the quest, simply edit the www/quests.json

Since www is the base-directory for the HTML content, all images are stored under www/img and then referenced using only the img/ as prefix on the JSON-file.

Each object in the JSON-file is composed of 5 values:
* lat - This is the latitude in decimal degrees.
* lon - This is the longitude in decimal degrees.
* radius - This is the radius, in meters, from the point defined in lat/lon. When a person playing the game comes within this radius to the point, she has finished this part of the quest. Keep in mind that GPS accuracy can vary, so you should not make this radius too small.
* This is the description/puzzle that gives clue as to where the person should go. HTMl formatting is allowed but you must take care of either escaping double-quotes or simply use single-quotes around parameters for the HTML tags.
* The user can optionally click the Vísbending (e. Hint) button. There is currently no support for deducting points or checking how many hints a user received.

You then have to recompile the project and create the APK file since all the content is bundled within the application package.

Have fun!
