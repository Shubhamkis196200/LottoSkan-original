import 'package:fluttertoast/fluttertoast.dart';

longToastMessage(String msg) {
  Fluttertoast.showToast(msg: msg, toastLength: Toast.LENGTH_LONG);
}
