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
1) install default raspbian, user: boatcam, pw:macmac, hostname: BigBoatCloseupCam
2) sudo apt update
3) sudo apt upgrade
4) sudo apt install apache2
5) sudo chmod a+w /var/www/html
6) sudo apt install php libapache2-mod-php
7) sudo apt install mariadb-server php-mysql
8) sudo service apache2 restart
9) sudo mysql
    1) CREATE DATABASE test;
    2) CREATE USER 'boatcam' IDENTIFIED BY 'macmac';
    3) GRANT ALL PRIVILEGES ON test.* TO 'boatcam'@'localhost' IDENTIFIED BY 'macmac';
    4) FLUSH PRIVILEGES;
    5) quit;
10) mysql -uboatcam -pmacmac test
    1) CREATE TABLE IF NOT EXISTS test ( line_id INT AUTO_INCREMENT, data VARCHAR(255) NOT NULL, PRIMARY KEY (line_id) );
    2) INSERT INTO test (data) VALUES ("This is a test string in my test database");
    3) quit;
11) sudo apt install phpmyadmin
    1) (press spacebar to choose apache2, then enter)
    2) (Configure database for phpmyadmin with dbconfig-common?..No)
12) sudo apt install libcamera0
13) sudo apt install libfreetype6
14) on the Mac, browse to github.com/bluenviron/mediamtx/releases & copy link to "arm64v8.tar.gz" NOT "amd..."
15) in RPi home directory type wget then paste the copied link
16) tar -xzf mediam<tab> --one-top-level
17) rm mediam<tab>.t<tab>
18) mv mediam<tab> mediamtx
19) cd mediamtx
20) nano mediamtx.yml
    1) at end of file delete everything after "paths:" and replace with:
    2) <space><space>cam:
    3) <space><space><space><space>source: rpiCamera
    4) <space><space><space><space>rpiCameraWidth: 1280
    5) <space><space><space><space>rpiCameraHeight: 720
    6) ctrl-O, <enter>, ctrl-X
    7) sudo nano /lib/systemd/system/mediamtx.service
        1) [Unit]
        2) Description=MediaMTX service
        3) After=multi-user.target
        4) -
        5) [Service]
        6) ExecStart=/home/boatcam/mediamtx/mediamtx /home/boatcam/mediamtx/mediamtx.yml
        7) -
        8) [Install]
        9) WantedBy=multi-user.target
    8) sudo systemctl daemon-reload
    9) sudo systemctl enable mediamtx.service
21) 
## Set up FreeFileSync
- left side = local mac development folder
- right side = (network cloud) sftp, boatcam, macmac, /var/www/html
