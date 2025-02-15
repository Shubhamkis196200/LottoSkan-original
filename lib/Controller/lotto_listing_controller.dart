import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:lotto_app/Api/api.dart';
import 'package:lotto_app/Common/Strings.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'package:lotto_app/Utils/dialog.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:store_redirect/store_redirect.dart';

class LottoListingController extends GetxController {
  RxBool isLoading = false.obs;
  List LOTTODATALIST = [];

  List LOTTODIMAGELIST = [];

  List LOTTOCOMMONTIMGLIST = [];

  List LOTTODASSETIMGLIST = [lotto, lottoplus, eurojackpot, multi, multiplus, miniLotto, ekastraPensja, ekstraPensiaPremia];

  @override
  void onInit() {
    getSettingApi();
    // getData();
    super.onInit();
  }

  getData() {
    isLoading.value = true;
    LOTTODATALIST = [];
    LOTTODIMAGELIST = [];
    LOTTOCOMMONTIMGLIST = [];
    getLottoList().then((value) {
      LOTTODATALIST = value!.result.docs;
      value.result.docs.forEach((element) {
        LOTTODIMAGELIST.add(element.lotteryImage.split("/").last);
      });
      LOTTOCOMMONTIMGLIST = LOTTODASSETIMGLIST.where((e) => LOTTODIMAGELIST.contains(e)).toList();
      isLoading.value = false;
    });
  }

  getSettingApi() async {
    await getSetting().then((value) async {
      var data = json.decode(value!.body);
      debugPrint("value is ${data["result"]["ads"]}");
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
      if(current_version != update_version){
        Get.dialog(AppUpdateDialog(current_version: version,
          update_version: newVersion, note: data["result"]["release_note"],
          onPressed: (){
            StoreRedirect.redirect(androidAppId: "com.lottoskan",
                iOSAppId: "1612823166").then((value){
              getSettingApi();
            });
          },
        ),barrierDismissible: false);
      }else{
        AppConstants.VERSION = newVersion;
        getData();
      }
    });
  }
}


