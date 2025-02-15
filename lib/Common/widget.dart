import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'Colors.dart';
import 'Strings.dart';
import 'app_theme.dart';

Widget customCard(image, text, customWidget) {
  return Container(
    margin: EdgeInsets.symmetric(horizontal: 24, vertical: 7),
    padding: EdgeInsets.symmetric(horizontal: 1, vertical: 18),
    decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15), color: cardColor),
    child: ListTile(
        leading: Image.asset(
          image,
          height: 200,
          width: 60,
          fit: BoxFit.fill,
        ),
        title: Text(text, style: title.copyWith(fontSize: 15)),
        trailing: customWidget),
  );
}

Widget customCard2(text, onPressed) {
  return GestureDetector(
    onTap: onPressed,
    child: Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(150),
      ),
      color: yellow,
      child: Container(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 2),
          child: Text(text)),
    ),
  );
}

Widget customCircle(text) {
  return Container(
    // margin: EdgeInsets.symmetric(horizontal: 12,vertical: 3),
    margin: EdgeInsets.symmetric(horizontal: 8),
    child: CircleAvatar(
      backgroundColor: yellow,
      radius: 21,
      child: CircleAvatar(
        backgroundColor: white,
        radius: 11,
        child: Text(text, style: title2),
      ),
    ),
  );
}

Widget customContainer(text) {
  return Container(
    // padding: EdgeInsets.symmetric(vertical: 15),
    margin: EdgeInsets.symmetric(horizontal: 12, vertical: 3),
    decoration: BoxDecoration(
      image: DecorationImage(
        image: AssetImage(delete),
        fit: BoxFit.cover,
      ),
    ),
    height: 32,
    width: 32,
    child: Center(
        child: Text(
      text,
      style: title2,
    )),
  );
}

Widget customButton(text, color, onPress) {
  return GestureDetector(
    onTap: onPress,
    child: Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 7, horizontal: 10),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: subtitle2,
      ),
    ),
  );
}

/// BOTH WIDGETS USED ON CONFORMATION SCREEN ====>

Widget customContainer2(
  text,
) {
  return Container(
    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
    decoration:
        BoxDecoration(borderRadius: BorderRadius.circular(22), color: white),
    child: Text(text, style: subtitle2),
  );
}

Widget customContainer3(
  text,
) {
  return Container(
    padding: EdgeInsets.symmetric(horizontal: 18, vertical: 10),
    decoration:
        BoxDecoration(borderRadius: BorderRadius.circular(22), color: white),
    child: Text(
      text,
      style: subtitle2,
      textAlign: TextAlign.center,
    ),
  );
}

Widget customButton2(text, color, onPress) {
  return GestureDetector(
    onTap: onPress,
    child: Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 7, horizontal: 27),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: subtitle2,
      ),
    ),
  );
}

/// TEXT FORM FIELD

Widget textFormField(double width, controller, icon, {onChanged}) {
  return Container(
    height: 41,
    child: TextFormField(
      inputFormatters: [
        LengthLimitingTextInputFormatter(34),
      ],
      onChanged: onChanged,
      controller: controller,
      // keyboardType: TextInputType.number,
      decoration: InputDecoration(
          suffixIcon: icon,
          focusColor: white,
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: white, width: 0.0),
            borderRadius: BorderRadius.circular(25.0),
          ),
          isDense: true,
          contentPadding: EdgeInsets.only(top: 10,bottom: 10,left: 15,right: -20),
          border: OutlineInputBorder(
              borderSide: BorderSide(color: white, width: 1.0),
              borderRadius: BorderRadius.circular(25)),
          filled: true,
          fillColor: white,
          // hintText: hint,
          hintStyle: TextStyle(fontWeight: FontWeight.w500, height: 0)),
    ),
  );
}

Widget textFormField2(double width, controller) {
  return Container(
    height: 41,
    child: TextFormField(
      inputFormatters: [
        LengthLimitingTextInputFormatter(5),
      ],
      controller: controller,
      textAlign: TextAlign.center,
      decoration: InputDecoration(
          focusColor: white,
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: white, width: 0.0),
            borderRadius: BorderRadius.circular(25.0),
          ),
          isDense: true,
          contentPadding: EdgeInsets.symmetric(horizontal: 7, vertical: 10),
          border: OutlineInputBorder(
              borderSide: BorderSide(color: white, width: 1.0),
              borderRadius: BorderRadius.circular(25)),
          filled: true,
          fillColor: white,
          hintStyle: TextStyle(fontWeight: FontWeight.w500, height: 0)),
    ),
  );
}

/// OTP

Widget otpTextFormField(controller) {
  return Container(
    height: 41,
    child: TextFormField(
      inputFormatters: [
        LengthLimitingTextInputFormatter(3),
      ],
      keyboardType: TextInputType.number,
      controller: controller,
      textAlign: TextAlign.center,
      textInputAction: TextInputAction.next,
      decoration: InputDecoration(
          focusColor: white,
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: white, width: 0.0),
            borderRadius: BorderRadius.circular(25.0),
          ),
          isDense: true,
          contentPadding: EdgeInsets.symmetric(horizontal: 3, vertical: 10),
          border: OutlineInputBorder(
              borderSide: BorderSide(color: white, width: 1.0),
              borderRadius: BorderRadius.circular(25)),
          filled: true,
          fillColor: white,
          hintStyle: TextStyle(fontWeight: FontWeight.w500, height: 0)),
    ),
  );
}
