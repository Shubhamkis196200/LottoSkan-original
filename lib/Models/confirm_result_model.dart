import 'dart:convert';

/*ConfirmResults confirmResultsFromJson(String str) => ConfirmResults.fromJson(json.decode(str));

String confirmResultsToJson(ConfirmResults data) => json.encode(data.toJson());

class ConfirmResults {
  ConfirmResults({
    required this.message,
    required this.result,
  });

  String message;
  Result result;

  factory ConfirmResults.fromJson(Map<String, dynamic> json) => ConfirmResults(
        message: json["message"],
        result: Result.fromJson(json["result"]),
      );

  Map<String, dynamic> toJson() => {
        "message": message,
        "result": result.toJson(),
      };
}

class Result {
  Result({
    required this.numbers,
     this.superNumbers,
  });

  List numbers;
  SuperNumbers? superNumbers;

  factory Result.fromJson(Map<String, dynamic> json) => Result(
        numbers:
            List.from(json["Numbers"].map((x) => SuperNumbers.fromJson(x))),
        superNumbers: json["superNumbers"] == ""? null: SuperNumbers.fromJson(json["superNumbers"]),
      );

  Map<String, dynamic> toJson() => {
        "Numbers": List.from(numbers.map((x) => x.toJson())),
        "superNumbers": superNumbers!.toJson(),
      };
}

class SuperNumbers {
  SuperNumbers({
    required this.matched,
    required this.type,
    required this.numberList,
    required this.amount,
  });

  int matched;
  int type;
  List numberList;
  int amount;

  factory SuperNumbers.fromJson(Map<String, dynamic> json) => SuperNumbers(
        matched: json["matched"],
        type: json["type"],
        numberList:
            List.from(json["numberList"].map((x) => NumberList.fromJson(x))),
        amount: json["amount"],
      );

  Map<String, dynamic> toJson() => {
        "matched": matched,
        "type": type,
        "numberList": List.from(numberList.map((x) => x.toJson())),
        "amount": amount,
      };
}

class NumberList {
  NumberList({
    required this.number,
    required this.matched,
  });

  int number;
  bool matched;

  factory NumberList.fromJson(Map<String, dynamic> json) => NumberList(
        number: json["number"],
        matched: json["matched"],
      );

  Map<String, dynamic> toJson() => {
        "number": number,
        "matched": matched,
      };
}*/


ConfirmResults confirmResultsFromJson(String str) => ConfirmResults.fromJson(json.decode(str));

String confirmResultsToJson(ConfirmResults data) => json.encode(data.toJson());

class ConfirmResults {
  ConfirmResults({
    required this.message,
    required this.result,
  });

  String message;
  List<ResultElement> result;

  factory ConfirmResults.fromJson(Map<String, dynamic> json) => ConfirmResults(
    message: json["message"],
    result: List<ResultElement>.from(json["result"].map((x) => ResultElement.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "result": List<dynamic>.from(result.map((x) => x.toJson())),
  };
}

class ResultElement {
  ResultElement({
    required this.date,
    required this.result,
  });

  DateTime date;
  ResultResult result;

  factory ResultElement.fromJson(Map<String, dynamic> json) => ResultElement(
    date: DateTime.parse(json["date"]),
    result: ResultResult.fromJson(json["result"]),
  );

  Map<String, dynamic> toJson() => {
    "date": date.toIso8601String(),
    "result": result.toJson(),
  };
}

class ResultResult {
  ResultResult({
    required this.numbers,
    this.superNumbers,
  });

  List<Number> numbers;
  SuperNumber? superNumbers;

  factory ResultResult.fromJson(Map<String, dynamic> json) => ResultResult(
    numbers: List<Number>.from(json["Numbers"].map((x) => Number.fromJson(x))),
    superNumbers: json["superNumbers"] == ""? null: SuperNumber.fromJson(json["superNumbers"]),
  );

  Map<String, dynamic> toJson() => {
    "Numbers": List<dynamic>.from(numbers.map((x) => x.toJson())),
    "superNumbers": superNumbers!.toJson(),
  };
}

class Number {
  Number({
    required this.matched,
    required this.type,
    required this.numberList,
    required this.amount,
  });

  int matched;
  int type;
  List<NumberList> numberList;
  int amount;

  factory Number.fromJson(Map<String, dynamic> json) => Number(
    matched: json["matched"],
    type: json["type"],
    numberList: List<NumberList>.from(json["numberList"].map((x) => NumberList.fromJson(x))),
    amount: json["amount"],
  );

  Map<String, dynamic> toJson() => {
    "matched": matched,
    "type": type,
    "numberList": List<dynamic>.from(numberList.map((x) => x.toJson())),
    "amount": amount,
  };
}

class SuperNumber {
  SuperNumber({
    required this.matched,
    required this.type,
    required this.numberList,
    required this.amount,
  });

  int matched;
  int type;
  List numberList;
  int amount;

  factory SuperNumber.fromJson(Map<String, dynamic> json) => SuperNumber(
    matched: json["matched"],
    type: json["type"],
    numberList:
    List.from(json["numberList"].map((x) => NumberList.fromJson(x))),
    amount: json["amount"],
  );

  Map<String, dynamic> toJson() => {
    "matched": matched,
    "type": type,
    "numberList": List.from(numberList.map((x) => x.toJson())),
    "amount": amount,
  };
}

class NumberList {
  NumberList({
    required this.number,
    required this.matched,
  });

  int number;
  bool matched;

  factory NumberList.fromJson(Map<String, dynamic> json) => NumberList(
    number: json["number"],
    matched: json["matched"],
  );

  Map<String, dynamic> toJson() => {
    "number": number,
    "matched": matched,
  };
}

