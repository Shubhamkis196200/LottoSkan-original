import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:lotto_app/Api/api.dart';
import 'package:lotto_app/Screens/ad_screen.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'package:lotto_app/Utils/dialog.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:store_redirect/store_redirect.dart';
import 'Common/Strings.dart';
import 'Common/language.dart';
import 'Screens/lotto_listing_screen.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    return GetMaterialApp(
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
        ],
        supportedLocales: const [
          Locale('pl'),
        ],
        translations: LocalStrings(),
        locale: Locale('pl', 'PL'),
        //locale: const Locale('pl'),
        theme: ThemeData(
          fontFamily: 'Poppins',
        ),
        debugShowCheckedModeBanner: false,
        home: MyHomePage());
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  void initState() {
    super.initState();
    Timer(Duration(seconds: 3), () {
      getSettingApi();
      // Get.offAll(LottoListing());
      // update();
    });
  }
  getSettingApi() async {
    await getSetting().then((value) async {
      var data = json.decode(value!.body);
      AppConstants.ISADS = data["result"]["ads"];
      String newVersion = Platform.isAndroid ? data["result"]["android_version"]
          : data["result"]["ios_version"];
      PackageInfo packageInfo = await PackageInfo.fromPlatform();
      String version = packageInfo.version;
      // String version = AppConstants.VERSION;
      debugPrint("Version: $version");
      int current_version = AppConstants.getExtendedVersionNumber(version);
      int update_version = AppConstants.getExtendedVersionNumber(newVersion);
      print('version is ${current_version < update_version}');
      if (current_version < update_version) {
        Get.dialog(AppUpdateDialog(current_version: version,
          update_version: newVersion, note: data["result"]["release_note"],
            onPressed: (){
              debugPrint("update Pressed");
              StoreRedirect.redirect(androidAppId: "com.lottoskan",
                  iOSAppId: "1612823166").then((value){
                    print("object");
                    getSettingApi();
                    // if(version == newVersion){
                    //   Get.back();
                    //   Get.offAll(LottoListing());
                    // }
              });
            }
        ),barrierDismissible: false);
      } else {
        Get.offAll(LottoListing());
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      // width: double.infinity,
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height,
      decoration: BoxDecoration(
        image: DecorationImage(
          fit: BoxFit.fill,
          image: AssetImage(
            SplashScreen,
          ),
        ),
      ),
    );
  }
}
