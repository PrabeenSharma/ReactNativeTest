import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  startDate: string;
  endDate: string;
  distance: string | number;
};

const RocketWebView: React.FC<Props> = ({
  startDate,
  endDate,
  distance
}) => {

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin:0; padding:0; }

      .bannerSidebar {width: 100%; position:relative;}
      .yourLocation{border-radius: 10px;position:relative;overflow:hidden;z-index: 2;aspect-ratio: 529 / 516}
      .yourLocationBg{position:absolute;top:0;left:0;width:100%;height:100%;z-index: -1}
      .yourLocationBg img{width:100%;height:100%;object-fit:cover;}
      .yourLocationText{position:absolute;top:5%;left: 6.5%;color:#fff;}
      .yourLocationEndImg{position:absolute;top:0;right:0;width:29%;}
      .yourLocationStartImg{position:absolute;bottom:0;left:0;width:70%;}
      .yourLocationEndImg img,.yourLocationStartImg img{width:100%;display:block;}

      .yourLocationStartArea {position: absolute;bottom: 17.64%;left: 27.3%;transform: translate(-50%, 50%);width: 50px;height: 18px;background: #fff;border-radius: 100%;z-index: 2;box-shadow: 0 0 6px 2px #60d3f6;display: flex;align-items:center;justify-content: center;}
      .yourLocationEndArea {position: absolute; top: 14.92%; right:7.18%; transform: translate(50%, -50%); width:25px; height:25px; background: #fff; border-radius: 100%; z-index: 2; box-shadow: 0 0 6px 2px #60d3f6;display: flex;align-items:center;justify-content: center; }
      .yourLocationStartArea::before,.yourLocationEndArea::before {width: 55%; height: 55%; border-radius: 100%; background: #60d3f6; content: ''; display:block; }

      .yourLocationRocketPath {width: 66.54%; height: 67.44%;position:absolute;top: 14.4%;right:7%;overflow:hidden; }
      .yourLocationRocketPath::before {width: 200%;height: 200%;border: 2px dashed #fff;content: '';position: absolute;top: 2px;left: 2px;border-radius: 50%;}
      .yourLocationRocketArea{width: 66.54%;height: 67.44%;position:absolute;top: 14.4%;right:7%;display: flex;flex-direction: column;justify-content: flex-end;align-items: flex-end;z-index: 2;transform-origin: bottom right;transition:0.5s}
      .yourLocationRocket {width:106.5%;transform-origin: bottom right;}
      .yourLocationRocket img{transform: rotate(6deg);width: 15.5%;}
    </style>
  </head>

  <body>

    <aside class="bannerSidebar">
      <div class="yourLocation">

        <div class="yourLocationBg">
          <img src="https://dev4work.com/thefirstonmars/wp-content/themes/red-planet-resort/assets/images/locationbg.jpg">
        </div>

        

        <div class="yourLocationEndImg">
          <img src="https://dev4work.com/thefirstonmars/wp-content/themes/red-planet-resort/assets/images/locationMars.png">
        </div>

        <div class="yourLocationEndArea"></div>

        <div class="yourLocationStartImg">
          <img src="https://dev4work.com/thefirstonmars/wp-content/themes/red-planet-resort/assets/images/locationEarth.png">
        </div>

        <div class="yourLocationStartArea"></div>

        <div class="yourLocationRocketPath"></div>

        <div class="yourLocationRocketArea" id="rocket">
          <div class="yourLocationRocket">
            <img src="https://dev4work.com/thefirstonmars/wp-content/themes/red-planet-resort/assets/images/rocket.png">
          </div>
        </div>

      </div>
    </aside>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <script>
      $(document).ready(function () {

        var today = new Date().toISOString().split('T')[0];

        var startDateText = formatDate("8-15-25");
        var endDateText = formatDate("9-15-26");
        var distanceText = "208018868".toString().replace(/,/g, '');

        function formatDate(input) {
        const parts = input.split('-');

        let month = parts[0].padStart(2, '0');
        let day = parts[1].padStart(2, '0');
        let year = parts[2];

        year = Number(year) < 50 ? '20' + year : '19' + year;

        return year + '-' + month + '-' + day;
      }

        function getDateOnly(dateString) {
          const date = new Date(dateString);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        const startDateObj = getDateOnly(startDateText);
        const endDateObj = getDateOnly(endDateText);
        const currentDate = getDateOnly(today);

        const totalDays = Math.floor((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
        const daysCovered = Math.floor((currentDate - startDateObj) / (1000 * 60 * 60 * 24));

        const totalDistance = Number(distanceText);
        const currentDistance = (totalDistance / totalDays) * daysCovered;

        let angle = (currentDistance / totalDistance) * 76;

        if (angle > 76) angle = 76;
        if (angle < 0) angle = 0;

        $('#rocket').css('transform', 'rotate(' + angle + 'deg)');
      });
    </script>

  </body>
  </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        key={startDate + endDate + distance}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default RocketWebView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 529 / 516,
    borderRadius:15,
    overflow:'hidden',
  }
});