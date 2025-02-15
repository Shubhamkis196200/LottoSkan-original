import 'package:get/get.dart';

class AppConstants {
  static String TICKETID = "";

  static List NOTEVALUE = [];

  static List<String> TICKET_LIST = [];

  static List<String> TICKET_LIST2 = [];

  static List SUPERNUMBERS = [];

  static List FINAL_LIST = [];

  static List<DateTime> DATELIST = [];

  static List<String> SUPERNUMBERLIST = [];

  static RxBool isSuperBtn = false.obs;

  static RxBool isSuperValue = false.obs;

  static String FDATE= "";
  static String TDATE= "";
  static String DISPLAYDATE= "";
  static bool ISADS= false;
  static String VERSION= '1.0.0';

  static int getExtendedVersionNumber(String version) {
    List versionCells = version.split('.');
    versionCells = versionCells.map((i) => int.parse(i)).toList();
    return versionCells[0] * 10000 + versionCells[1] * 100 + versionCells[2];
  }
}
