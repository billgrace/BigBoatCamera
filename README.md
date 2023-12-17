# Big Boat Closeup Camera

After a big boat in the Guemes channel is recognized by the low resolution spotter cam, the
closeup camera aims toward the location of the boat and records a video as the boat passes
through the channel.

The code in this repository will run on a Raspberry Pi 4B and implement several functions:
1) serve a web page showing the live video
2) operate the motors to keep the camera tracking on the moving boat
3) retrieve the AIS information about the boat
4) maintain storage to save the video and related information

## Prepare the raspberry pi
- install default raspbian, user: boatcam, pw:macmac, hostname: BigBoatCloseupCam
- sudo apt update
- sudo apt upgrade
- sudo apt install apache2
- sudo chmod a+w /var/www/html
- 

## Set up FreeFileSync
- left side = local mac development folder
- right side = (network cloud) sftp, boatcam, macmac, /var/www/html
