import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wenyousite_foundation/wenyousite_foundation.dart';

void main() {
  testWidgets('语义图标在较大控件约束内保持声明尺寸', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Center(
            child: SizedBox.square(
              dimension: 48,
              child: WenyouIcon(
                WenyouIconIds.identityMember,
                size: 20,
              ),
            ),
          ),
        ),
      ),
    );

    expect(tester.getSize(find.byType(WenyouIcon)), const Size.square(48));
    expect(tester.getSize(find.byType(SvgPicture)), const Size.square(20));
  });
}
