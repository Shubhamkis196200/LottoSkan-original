import 'package:google_ml_vision/google_ml_vision.dart';
import 'package:lotto_app/Utils/appConstants.dart';

class MlApis {
  static Future<String> recogniseText(
      GoogleVisionImage? imageFile, String id) async {
    TextRecognizer textRecognizer = GoogleVision.instance.textRecognizer();
    if (imageFile == null) {
      return 'No selected image';
    } else {
      // final visionImage = FirebaseVisionImage.fromFile(imageFile);
      final VisionText visionText =
          await textRecognizer.processImage(imageFile);
      textRecognizer.close();
      // final textRecognizer = FirebaseVision.instance.textRecognizer();
      try {
        // final visionText = await textRecognizer.processImage(visionImage);
        // await textRecognizer.close();

        final text = extractText(visionText, id);
        return text.isEmpty ? 'No text found in the image' : text;
      } catch (error) {
        return error.toString();
      }
    }
  }

  static extractText(visionText, id) {
    String text = '';
    RegExp ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
    switch (id) {
      case "61dbf483cc484f2c593b3953":
        //print("Lotto=>${regexNumber}");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf4d3cc484f2c593b3958":
        //print("Lotto Plus");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf513cc484f2c593b395d":
        //print("Euro Jackpot");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf5eacc484f2c593b3962":
        //print("Multi Multi");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf619cc484f2c593b3967":
        //print("Multi Multi Plus");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf6a8cc484f2c593b396a":
        //print("Mini Lotto");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf75ecc484f2c593b3970":
        //print("EKStra Pensja");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;

      case "61dbf7a2cc484f2c593b3973":
        //print("EKStra Pensja EKStra Premia");
        ticketRegex = RegExp(r"\d\d[\s]\d\d[\s]\d\d[\s]\d\d[\s]\d\d");
        break;
        default:
    }
    RegExp dateRegex = RegExp(r"\b\d\d[.]\d\d[.]\d\d");
    RegExp singleDigit = RegExp(r"\b\d\b$");
    //RegExp singleDigit = RegExp(r"\d[\s]\d");
    int i = 0;
    for (TextBlock block in visionText.blocks) {
      final List<RecognizedLanguage> languages = block.recognizedLanguages;
      //print("Language $languages");
      //print("ticketregx $ticketRegex");

      for (TextLine line in block.lines) {
        // Same getters as TextBlock
        print("line $i : ${line.text} ");
        if (ticketRegex.hasMatch(line.text!)) {
          // text = text + line.text + '\n';
          AppConstants.TICKET_LIST.add(
              line.text!.replaceAll(RegExp(r"\d[:]"), "").replaceAll(":", ""));
        }
        print("id == ${id}");
        if (id == "61dbf6a8cc484f2c593b396a" || id == "61dbf75ecc484f2c593b3970"||id=="61dbf7a2cc484f2c593b3973") {
          //print("ticket 5 || 6");
          if (singleDigit.hasMatch(line.text!)) {
             text = text + line.text! + '\n';

            /// to add single digit ===>
            AppConstants.TICKET_LIST2 = [];
            /*AppConstants.TICKET_LIST2.add(
                line.text!.replaceAll(RegExp(r"\d[:]"), "").replaceAll(":", ""));*/
          }
        }
        List values = [];
        //print("objectFinalList=${AppConstants.FINAL_LIST.length}");
        for (int i = 0; i < AppConstants.FINAL_LIST.length; i++) {
          final regexForNumber = RegExp(r'^[0-9 ]+$').hasMatch(AppConstants.FINAL_LIST[i]);
          values.add(regexForNumber);
        }
      }
      i++;
    }

    /// to add zeros to single digit textformfield ==>
    print("Object Length=>${AppConstants.TICKET_LIST.length} ${AppConstants.TICKET_LIST2.length}");
    if (AppConstants.TICKET_LIST.length != AppConstants.TICKET_LIST2.length) {
      int z = AppConstants.TICKET_LIST2.length;
      for (z = AppConstants.TICKET_LIST2.length; z < AppConstants.TICKET_LIST.length; z++) {
        AppConstants.TICKET_LIST2.add('0');
      }
    }
    return text;
  }
}
