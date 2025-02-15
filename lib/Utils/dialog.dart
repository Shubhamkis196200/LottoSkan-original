import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:lotto_app/Common/Colors.dart';

class AppUpdateDialog extends StatelessWidget {
  String update_version, current_version, note;
  void Function() onPressed;
  AppUpdateDialog({Key? key, required this.update_version,
  required this.current_version, required this.note, required this.onPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Card(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20)
              ),
              child: Container(
                width: Get.width,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("Zaktualizować aplikację?", style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold
                      )),
                      SizedBox(height: 10),
                      Align(
                        alignment: Alignment.center,
                        child: Text("Nowa wersja LottoSkan jest już dostępna!",
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 15)
                        ),
                      ),
                      SizedBox(height: 10),
                      Text("Musisz zaktualizować tę aplikację,\naby kontynuować",
                         textAlign: TextAlign.center, style: TextStyle(
                        fontSize: 15,
                      )),
                      SizedBox(height: 10),
                      Text("Uwagi do wydania:", style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold
                      )),
                      SizedBox(height: 5),
                      Text('$note', style: TextStyle(fontSize: 16),
                      ),
                      SizedBox(height: 10),
                      GestureDetector(
                        onTap: onPressed,
                        child: Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(150),
                          ),
                          color: yellow,
                          child: Container(
                              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                              child: Text('Zaktualizuj teraz', style: TextStyle(fontWeight: FontWeight.bold))),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
