import 'dart:io';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:get/get.dart';


Future<bool> isConnected() async {
  try {
    final result = await InternetAddress.lookup('google.com');
    if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
      print('connected');
      return true;
    } else {
      return false;
    }
  } on SocketException catch (_) {
    print('not connected');
    Fluttertoast.showToast(
        msg: 'No internet'.tr,
        toastLength: Toast.LENGTH_LONG);
    return false;
  }
}