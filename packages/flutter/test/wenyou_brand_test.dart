import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wenyousite_foundation/wenyousite_foundation.dart';

void main() {
  test('品牌契约公开稳定名称、文案与移动端尺寸', () {
    expect(WenyouBrandContract.name, '温油站');
    expect(WenyouBrandContract.tagline, '最温油的文字共创社区');
    expect(WenyouBrandContract.startupMarkSize, 96);
    expect(WenyouBrandContract.authMarkSize, 48);
    expect(WenyouBrandContract.appBarMarkSize, 24);
  });

  testWidgets('相邻可见名称时品牌标识不重复朗读', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: WenyouBrandMark.decorative(size: 48)),
    );

    final image = tester.widget<Image>(find.byType(Image));
    expect(image.excludeFromSemantics, isTrue);
  });

  testWidgets('单独品牌标识要求并公开语义名称', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: WenyouBrandMark.semantic(semanticLabel: '温油站')),
    );

    expect(find.bySemanticsLabel('温油站'), findsOneWidget);
  });
}
