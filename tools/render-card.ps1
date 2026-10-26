# Recria o cartão PNG sem instalar dependências (Windows / System.Drawing).
Add-Type -AssemblyName System.Drawing
$cardRoot = Split-Path -Parent $PSScriptRoot
$bitmap = New-Object System.Drawing.Bitmap 1440,1920
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
$g.ScaleTransform(2,2)
function Color($hex) { [System.Drawing.ColorTranslator]::FromHtml($hex) }
function Brush($hex) { New-Object System.Drawing.SolidBrush (Color $hex) }
function Pen($hex, $width) { New-Object System.Drawing.Pen (Color $hex),$width }
function Label($text,$y,$size,$hex,$italic=$false) {
  $style = if ($italic) { [System.Drawing.FontStyle]::Italic } else { [System.Drawing.FontStyle]::Regular }
  $font = New-Object System.Drawing.Font 'Georgia',$size,$style,([System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = 'Center'
  $format.LineAlignment = 'Center'
  $brush = Brush $hex
  $g.DrawString($text,$font,$brush,([System.Drawing.RectangleF]::new(45,$y,630,($size*2))),$format)
  $brush.Dispose(); $font.Dispose(); $format.Dispose()
}
try {
  $paper = New-Object System.Drawing.Drawing2D.LinearGradientBrush ([System.Drawing.Point]::new(0,0)),([System.Drawing.Point]::new(0,960)),(Color '#fffaf0'),(Color '#f9e8d8')
  $g.FillRectangle($paper,0,0,720,960)
  $g.DrawRectangle((Pen '#c8a87f' 1),27,27,666,906)
  $g.DrawRectangle((Pen '#e5ceac' 1),39,39,642,882)
  $g.FillEllipse((Brush '#f7e8cc'),157,167,406,406)
  Label 'UM JARDIM SÓ SEU' 74 15 '#946943'
  Label 'Para Sara,' 125 62 '#9d5368' $true
  $stem = New-Object System.Drawing.Drawing2D.GraphicsPath
  $stem.AddBezier(360,432,349,490,357,540,361,591)
  $g.DrawPath((Pen '#66845b' 13),$stem)
  $state=$g.Save(); $g.TranslateTransform(320,525); $g.RotateTransform(30); $g.FillEllipse((Brush '#83a06c'),-55,-17,100,36); $g.Restore($state)
  $state=$g.Save(); $g.TranslateTransform(400,550); $g.RotateTransform(-35); $g.FillEllipse((Brush '#83a06c'),-45,-17,100,36); $g.Restore($state)
  for($i=0;$i -lt 14;$i++) {
    $state=$g.Save(); $g.TranslateTransform(360,378); $g.RotateTransform($i*360/14)
    $petal=New-Object System.Drawing.Drawing2D.LinearGradientBrush ([System.Drawing.Point]::new(0,-157)),([System.Drawing.Point]::new(0,-17)),(Color '#f7d985'),(Color '#dca14a')
    $g.FillEllipse($petal,-25,-157,50,140); $petal.Dispose(); $g.Restore($state)
  }
  $g.FillEllipse((Brush '#895a3b'),299,317,122,122)
  $g.DrawEllipse((Pen '#b27e4c' 7),299,317,122,122)
  $g.FillEllipse((Brush '#372a26'),335,363,10,14); $g.FillEllipse((Brush '#372a26'),375,363,10,14)
  $g.FillEllipse((Brush '#d99184'),315,385,20,10); $g.FillEllipse((Brush '#d99184'),385,385,20,10)
  $g.DrawArc((Pen '#372a26' 3),347,382,26,22,15,150)
  $state=$g.Save(); $g.TranslateTransform(360,575); $g.RotateTransform(-5)
  $g.FillRectangle((Brush '#fff2d9'),-46,-20,92,37); $g.DrawRectangle((Pen '#c5a072' 1),-46,-20,92,37)
  $font=New-Object System.Drawing.Font 'Georgia',22,([System.Drawing.FontStyle]::Italic),([System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString('Pingo',$font,(Brush '#755334'),-29,-16); $font.Dispose(); $g.Restore($state)
  Label 'Algumas coisas bonitas' 623 28 '#674b40'
  Label 'merecem florescer de novo.' 662 28 '#674b40' $true
  $palette=@('#e9b6be','#ede3b4','#c6bed5')
  for($i=0;$i -lt 12;$i++) {
    $x=55+$i*56; $y=758+($i%3)*15; $r=7+($i%3)
    $g.DrawLine((Pen '#68845b' 2),$x,$y,$x,822)
    $flower=Brush $palette[$i%3]
    $g.FillEllipse($flower,($x-$r),($y-2*$r),(2*$r),(2*$r)); $g.FillEllipse($flower,$x,($y-$r),(2*$r),(2*$r)); $g.FillEllipse($flower,($x-$r),$y,(2*$r),(2*$r)); $g.FillEllipse($flower,($x-2*$r),($y-$r),(2*$r),(2*$r))
    $g.FillEllipse((Brush '#c39b55'),($x-4),($y-4),8,8); $flower.Dispose()
  }
  $g.DrawLine((Pen '#b8bf9e' 1),61,838,659,838)
  Label 'feito com carinho, só pra você' 850 18 '#896951' $true
  $bitmap.Save((Join-Path $cardRoot 'assets/sara-pingo.png'),[System.Drawing.Imaging.ImageFormat]::Png)
} finally { $g.Dispose(); $bitmap.Dispose() }

