import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';
import 'package:lotto_app/Api/api.dart';
import 'package:lotto_app/Screens/ad_screen.dart';
import 'package:lotto_app/Screens/confirm_result_screen.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'package:lotto_app/Utils/myToasts.dart';

class ConfirmationScreenController extends GetxController {
  RxBool isLoading = false.obs;
  RxBool isVisible = false.obs;

  var length = AppConstants.TICKET_LIST.length;

  List<String>otpList = [];

  List <TextEditingController>otpListTextEditingController = [];

  List <TextEditingController>textEditingControllers = [];

  List <TextEditingController>singleDigitTextEditingControllers = [];

  List SINGLEDIGITFINAL_LIST = [];

  List DATELIST = [];
  DateList docList = DateList(doc: DateTime.now());

  RxBool checkValues = false.obs;


  @override
  void onInit() {
    //getDates();
    setValuesForMultiDigit();
    setSingleDigitValues();
    otpListTextEditingController.clear();
    super.onInit();
  }

  otpSetValues() {
    otpListTextEditingController = [];
    otpListTextEditingController.clear();
    otpList = ["", "", "", "", "", "",""];
    /// to create text editing controller for otp text field digit ===>
    otpList.forEach((String str) {
      var textEditingController = TextEditingController(text: str);
      // AppConstants.otpTextEditingControllers.add(textEditingController);
      otpListTextEditingController.add(textEditingController);
    });
  }

  setValuesForMultiDigit() {
    textEditingControllers = [];
    /// to create text editing controller for multi digit ===>
    AppConstants.TICKET_LIST.forEach((String str) {
      var textEditingController = TextEditingController(text: str);
      textEditingControllers.add(textEditingController);
    });
  }

  setSingleDigitValues() {
    singleDigitTextEditingControllers = [];
    /// to create text editing controller for single digit ===>
    if (AppConstants.TICKET_LIST2.length > 0) {
      AppConstants.TICKET_LIST2.forEach((String string) {
        var singleDigitTextEditingController =
            TextEditingController(text: string);
        singleDigitTextEditingControllers
            .add(singleDigitTextEditingController);
      });
    }
  }

  /// to add both multi and single digit data to  final list from text editing controllers

  getValues() {
    AppConstants.FINAL_LIST = [];
    SINGLEDIGITFINAL_LIST = [];

    for (int l = 0; l < textEditingControllers.length; l++) {
      AppConstants.FINAL_LIST
          .add(textEditingControllers[l].text.trim());
    }
    if (AppConstants.TICKET_LIST2.length > 0) {
      for (int n = 0;
          n < singleDigitTextEditingControllers.length;
          n++) {
        SINGLEDIGITFINAL_LIST.add(
            [singleDigitTextEditingControllers[n].text.trim()]);
      }
    }

    List value = AppConstants.FINAL_LIST;
    AppConstants.FINAL_LIST = [];

    if (AppConstants.TICKET_LIST2.length > 0) {
      for (int i = 0; value.length > i; i++) {
        AppConstants.FINAL_LIST
            .add("${value[i]} ${(SINGLEDIGITFINAL_LIST[i][0])}");
      }
    } else {
      for (int i = 0; value.length > i; i++) {
        AppConstants.FINAL_LIST.add("${value[i]}");
      }
    }
    List values = [];

    for (int i = 0; i < AppConstants.FINAL_LIST.length; i++) {
      final regexForNumber =
          RegExp(r'^[0-9 ]+$').hasMatch(AppConstants.FINAL_LIST[i]);
      values.add(regexForNumber);
      if (textEditingControllers[i].text == "") {
        checkValues.value = true;
      }
    }

    for (int i = 0; i < values.length; i++) {
      if (values[i] == false) {
        checkValues.value = true;
      }
    }
    if (checkValues.value == true) {
      longToastMessage('Please enter correct values'.tr);
    } else {
      AppConstants.DATELIST=[];
      Get.off(ConFirmResultScreen());
    }
  }

  setNewValues() {
    for (int a = 0; a < AppConstants.TICKET_LIST.length; a++) {
      AppConstants.TICKET_LIST[a] = textEditingControllers[a].text;
      if (AppConstants.TICKET_LIST2.length > 0) {
        AppConstants.TICKET_LIST2[a] =
            singleDigitTextEditingControllers[a].text;
      }
    }

    AppConstants.TICKET_LIST.add("");
    if (AppConstants.TICKET_LIST2.length > 0) {
      AppConstants.TICKET_LIST2.add("");
      singleDigitTextEditingControllers = [];
    }

    textEditingControllers = [];
  }

  /// ========== SUPER NUMBER Validation and Controller ===>

  setSuperValues() {
    List values = [];
    List a = [];
    checkValues.value = false;
    AppConstants.isSuperValue.value = false;
    AppConstants.SUPERNUMBERLIST = [];
    AppConstants.SUPERNUMBERS = [];
    for (int i = 0; i < otpListTextEditingController.length; i++) {
      a.add(otpListTextEditingController[i].text);
      if (a[i] != ""){
        final regexForNumber =
        RegExp(r'^[0-9 ]+$').hasMatch(a[i]);
        values.add(regexForNumber);
        if (values[i] == false) {
          checkValues.value = true;
        }
      }
    }
    if (a.length == 0) {
      AppConstants.isSuperValue.value = true;
    } else {
      AppConstants.isSuperValue.value = false;
    }
    var strList = a.join(" ");
    AppConstants.SUPERNUMBERLIST.add(strList.trim());
    if (AppConstants.SUPERNUMBERLIST[0] == "") {
      AppConstants.isSuperValue.value = true;
    }
  }

  getDates() {
    DATELIST = [];
    getDateList().then((value) {
      DATELIST = value!.result;
      value.result.forEach((element) {
        docList = DateList(doc: element.date);
        AppConstants.DATELIST.add(docList.doc);
      });
      print("AppConstantList====${AppConstants.DATELIST.length}");
    });
  }
}


class DateList {
  final DateTime doc;

  DateList({
  required this.doc,
  });
}