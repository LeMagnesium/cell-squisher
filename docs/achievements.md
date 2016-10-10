# Achievements Management Module

# Summary
 - Public :
  - `squish.achievements`
  - `squish.achievements.register`
  - `squish.achievements.is_triggered`
  - `squish.achievements.get_data`
  - `squish.achievements.trigger`
  - `squish.achievements.build_main_menu_component`
 - Private :
  - `achamount`
  - `achievements`

# Public
### Namespaces
 - `squish.achievements` : Public exposure namespace for all API methods

### functions
 - `squish.achievements.register` : This function takes the name of an achievement, its trigger and an object of data related to it. The achievement's data are stored in private `achievements`, and private `achamount` is increased by one
 - `squish.achievement.is_triggered` : Takes one parameter, an achievement's name, and returns a boolean corresponding to its state (triggered, or not)
 - `squish.achievements.get_data` : This method returns the object containing all data given when registering an achievement
 - `squish.achievements.trigger` : Triggers an achievement. This method launches all responses to the achievement being triggered (and it can only happen once)
 - `squish.achievements.build_main_menu_component` : This function computes and returns the array containing all graphical components to be drawn in the Main Menu's achievement section

# Private
### Variables
 - `var achamount = 0` : This integer keeps track of the amount of achievements regisetered. It is a workaround to get the total amount of achievements despite their data being stored in an object (dictionary)
 - `var achievements = {}` : This object holds all of the achievements' definition data, storing data of an achievement called `name` in `æchievements[name]`
