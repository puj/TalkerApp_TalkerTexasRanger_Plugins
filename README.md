# TalkerAppPlugins
A collection of plugins which can be added to the Talker Texas Ranger

1.  Download a plugin (.js)
2.  Place the plugin in the plugins/ folder within TalkerTexasRanger
3.  Update the config.json to include the plugin
     ...
     ,
     "plugins": [
     "pingpong",
     *"broadcast"*
     ],
     ...

## broadcast.js
A plugin which allows users to use the '!broadcast' command.
!broadcast Hey everyone.

Results in chuck.norris broadcasting '(broadcaster_username) Hey everyone.' to all rooms to which he is connected.


## math.js
A plugin to allow users to use the '!math' command
!math 2+3*4/2

Results in : 8

Current operators are *, / , \ , +, -   
Operators are processed in normal order of precedence.  Also, left-to-right.

Recursion is used.

## color-converter.js
A plugin to allow users to use the '!color' command

!color #FFFFFF

Results in : #FFFFFF = rgb(255, 255, 255)

!color rgb(36,36,36)

Results in : #242424 = rgb(36, 36, 36)

Acceptable formats include:

!color FFFFFF  
!color parse this color please FFFFFF  
!color $FFFFFF!!!! etc etc  
!color 255,255,255  
!color parse this color please 255,255,255  

Bounds are checked between 0-255 for rgb elements
Bounds are checked between 0-FF for hex elements

Also, if rgb elements have decimals, they are rounded using parseInt()  
There is no support currently for the 0-1.0 rgb scale.