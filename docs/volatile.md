# Volatile Memory Module's Documentation

# Summary
 - Public :
  - `squish.volatile`
  - `squish.volatile.store`
  - `squish.volatile.read`
  - `squish.volatile.exists`
  - `squish.volatile.delete`
 - Private :
  - `register`

# Public
### Namespaces
 - `squish.volatile` : The Volatile Memory Module's (VMM's) namespace. Contains all functions related to the allocation, usage, checking and deletion of volatile memory spaces

### Functions
 - `function squish.volatile.store(name, val)` : This function stores the value `val` (of any kind) in the volatile registery. The value is tied to the field name `name`. If a value previously existed in that field, it is discarded and replaced. This method works much like JavaScript's (ECMAScript's) or Python's dynamic memory allocation : it defines the variable if it hadn't been used previously, and overwrites already defined variables.
 - `function squish.volatile.read(name)` : Returns the value stored in the volatile memory register in the field `name`. It is `null` for undefined fields.
 - `function squish.volatile.exists(name)` : Checks whether or not the volatile register has a value stored in the field `name` and return a boolean according to that test.
 - `function squish.volatile.delete(name)` : Deletes any value that would be stored in the register in the field `name`. **Note** : Using delete on undefined fields doesn't cause any trouble.

# Private
### Variables
 - `var register = {}` : This is the Volatile Memory Module's register. It stores all values requested through `squish.volatile.store` and is read upon using `squish.volatile.read` and `squish.volatile.exists`.

# Examples

### *Using the VMM to store a temporary state*
```javascript
// Adapted from squish.achievements.build_main_menu_component
squish.volatile.store("mainmenu_ach_careas_created_control", true);
function build_main_menu_component() {
        // Computing and definition of graphical components happens here...
        for (var x in achievements) {
                // But the first time we need to register a clickable area for each achievement
                if (squish.volatile.exists("mainmenu_ach_careas_created_control")) {
                        // Registering happens here only once
                }
        }
        // The registration done, if the volatile variable still exists, we delete it
        if (squish.volatile.exists("mainmenu_ach_careas_created_control")) {
                squish.volatile.delete("mainmenu_ach_careas_created_control");
        }

        // The function returns its stuff here..
}
```
