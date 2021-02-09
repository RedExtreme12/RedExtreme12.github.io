
$(function() {
    
    function fromHEXToRGB(hexString) {
        if (hexString.charAt(0) === '#') {
            hexString = hexString.substr(1);
        }

        if ((hexString.length < 2) || (hexString.length > 6)) {
            return false;
        }

        let values = hexString.split(''),
            r,
            g,
            b;

        if (hexString.length === 2) {
            r = parseInt(values[0].toString() + values[1].toString(), 16);
            g = r;
            b = r;
        } else if (hexString.length === 3) {
            r = parseInt(values[0].toString() + values[0].toString(), 16);
            g = parseInt(values[1].toString() + values[1].toString(), 16);
            b = parseInt(values[2].toString() + values[2].toString(), 16);
        } else if (hexString.length === 6) {
            r = parseInt(values[0].toString() + values[1].toString(), 16);
            g = parseInt(values[2].toString() + values[3].toString(), 16);
            b = parseInt(values[4].toString() + values[5].toString(), 16);

        } else {
            return false;
        }

        return [r, g, b];
    }

    function fromRGBToCMYK(rgbParams) {
        const r = rgbParams[0];
        const g = rgbParams[1];
        const b = rgbParams[2];

        const R = r / 255;
        const G = g / 255;
        const B = b / 255;

        const K = 1 - Math.max(R, G, B);

        const C = (1 - R - K) / (1 - K);
        const M = (1 - G - K) / (1 - K);
        const Y = (1 - B - K) / (1 - K);

        return [C, M, Y, K];
    }

    function fromCMYKToRGB(cmykParams) {
        const c = cmykParams[0] / 100;
        const m = cmykParams[1] / 100;
        const y = cmykParams[2] / 100;
        const k = cmykParams[3] / 100;

        const r = 255 * (1 - c) * (1 - k);
        const g = 255 * (1 - m) * (1 - k);
        const b = 255 * (1 - y) * (1 - k);

        return [Math.trunc(r), Math.trunc(g), Math.trunc(b)];
    }

    function fromRGBToHSV(rgbParams) {
        const r = rgbParams[0] / 255;
        const g = rgbParams[1] / 255;
        const b = rgbParams[2] / 255;
  
        const cmax = Math.max(r, Math.max(g, b));
        const cmin = Math.min(r, Math.min(g, b));
        const diff = cmax - cmin;
        let h = -1, s = -1;
  
        if (cmax == cmin) {
            h = 0;
        } else if (cmax == r) {
            h = (60 * ((g - b) / diff) + 360) % 360;
        } else if (cmax == g) {
            h = (60 * ((b - r) / diff) + 120) % 360; 
        } else if (cmax == b) {
            h = (60 * ((r - g) / diff) + 240) % 360; 
        }
  
        if (cmax == 0) {
            s = 0;
        } else {
            s = (diff / cmax) * 100;
        }
  
        const v = cmax * 100;
        return [h, s, v];
    }

    function fromHSVToRGB(hsvParams) {
        let h = hsvParams[0], s = hsvParams[1] / 100, v = hsvParams[2] / 100;
        let r = 0, g = 0, b = 0;
        if (s == 0) {
            r = v, g = v, b = v;
        } else {
            let i, f, p, q, t;
  
            if (h == 360) {
                h = 0;
            } else {
                h /= 60;
            }
  
            i = Math.trunc(h);
            f = h - i;
  
            p = v * (1 - s);
            q = v * (1 - (s * f));
            t = v * (1 - (s * (1 - f)));
  
            switch (i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
  
                case 3:
                    r = p;
                    g = q;
                    b = b;
                    break;
  
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
  
                default:
                    r = v;
                    g = p;
                    b = q;
                    break;
            }
        }
  
        return [Math.trunc(r * 255), Math.trunc(g * 255), Math.trunc(b * 255)];
    }

    function updateColorModelValuesFromHEX(hexColor) {
        const rgbParams = fromHEXToRGB(hexColor);
        setRGBParams(rgbParams);
        setCMYKParams(fromRGBToCMYK(rgbParams));
        setHSVParams(fromRGBToHSV(rgbParams));
    }

    function setRGBParams(rgbParams) {
        $('#rgb-red').val(rgbParams[0]);
        $('#rgb-green').val(rgbParams[1]);
        $('#rgb-blue').val(rgbParams[2]);

        $('#rgb-red-slider').slider('value', rgbParams[0]);
        $('#rgb-green-slider').slider('value', rgbParams[1]);
        $('#rgb-blue-slider').slider('value', rgbParams[2]);
    }

    function updateColorModelValuesFromRGB(rgbParams) {
        picker.fire("change", [`rgb(${rgbParams[0]}, ${rgbParams[1]}, ${rgbParams[2]})`], 'without-update');
        setCMYKParams(fromRGBToCMYK(rgbParams));
        setHSVParams(fromRGBToHSV(rgbParams));
    }

    function updateColorModelValuesFromHSV(hsvParams) {
        const rgbParams = fromHSVToRGB(hsvParams);
        picker.fire("change", [`rgb(${rgbParams[0]}, ${rgbParams[1]}, ${rgbParams[2]})`], 'without-update');
        setRGBParams(rgbParams);
        setCMYKParams(fromRGBToCMYK(rgbParams));
    }

    function updateColorModelValuesFromCMYK(CMYKParams) {
        const rgbParams = fromCMYKToRGB(CMYKParams);
        picker.fire("change", [`rgb(${rgbParams[0]}, ${rgbParams[1]}, ${rgbParams[2]})`], 'without-update');
        setRGBParams(rgbParams);
        setHSVParams(fromRGBToHSV(rgbParams));
    }

    function setCMYKParams(cmykParams) {
        $('#CMYK-C').val(cmykParams[0]);
        $('#CMYK-M').val(cmykParams[1]);
        $('#CMYK-Y').val(cmykParams[2]);
        $('#CMYK-K').val(cmykParams[3]);

        $('#CMYK-C-slider').slider('value', cmykParams[0]);
        $('#CMYK-M-slider').slider('value', cmykParams[1]);
        $('#CMYK-Y-slider').slider('value', cmykParams[2]);
        $('#CMYK-K-slider').slider('value', cmykParams[3]);
    }

    function setHSVParams(hsvParams) {
        $('#hsv-hue').val(hsvParams[0]);
        $('#hsv-saturation').val(hsvParams[1]);
        $('#hsv-value').val(hsvParams[2]);
  
        $('#hsv-hue-slider').slider('value', hsvParams[0]);
        $('#hsv-saturation-slider').slider('value', hsvParams[1]);
        $('#hsv-value-slider').slider('value', hsvParams[2]);
    }

    const picker = new CP(document.querySelector('input#floating-color-picker'));
    picker.on('change', function(color) {
        const hexColor = '#' + color;

        $('.background').css('background-color', hexColor);
        updateColorModelValuesFromHEX(color);
    });

    picker.on('change', function(color) {
        const hexColor = '#' + color;

        console.log('hello from cmyk!');
        console.log(hexColor);

        $('.background').css('background-color', hexColor);
    }, 'without-update');
    
    $('.rgb-slider').slider({
        min: 0,
        max: 255,
        slide: function(event, ui) {
            const sliderId = $(this).attr('id');
            const inputId = '#' + sliderId.substring(0, sliderId.indexOf('-slider'));
            $(inputId).val(ui.value);

            updateColorModelValuesFromRGB([$('#rgb-red').val(), $('#rgb-green').val(), $('#rgb-blue').val()]);
        }
    });

    $('.CMYK-slider').slider({
        min: 0,
        max: 100,
        slide: function(event, ui) {
            const sliderId = $(this).attr('id');
            const inputId = '#' + sliderId.substring(0, sliderId.indexOf('-slider'));

            $(inputId).val(ui.value);
            updateColorModelValuesFromCMYK([parseFloat($('#CMYK-C').val()), parseFloat($('#CMYK-M').val()), parseFloat($('#CMYK-Y').val()), parseFloat($('#CMYK-K').val())]);
        }
    });
    
    $('.hsv-slider').slider({
        min: 0,
        max: 100,
        slide: function(event, ui) {
            const sliderId = $(this).attr('id');
            const inputId = '#' + sliderId.substring(0, sliderId.indexOf('-slider'));
  
            $(inputId).val(ui.value);
            updateColorModelValuesFromHSV([parseFloat($('#hsv-hue').val()), parseFloat($('#hsv-saturation').val()), parseFloat($('#hsv-value').val())]);
        }
    });

    $('#CMYK-C-slider').slider('option', 'max', 100);
    $('#hsv-hue-slider').slider('option', 'max', 360);

    $('.rgb-color-param').on('change', function() {
        const newValue = $(this).val();

        if (newValue < 0) {
            $(this).val(0);
        } else if (newValue > 255) {
            $(this).val(255);
        }

        console.log('dsadsadas');

        $('#' + $(this).attr('id') + '-slider').slider('value', $(this).val());
        updateColorModelValuesFromRGB([$('#rgb-red').val(), $('#rgb-green').val(), $('#rgb-blue').val()]);
    });

    $('.cmyk-color-param').on('change', function() {
        const sliderId = '#' + $(this).attr('id') + '-slider';

        const newValue = $(this).val();
        $(this).val(Math.max(newValue, $(sliderId).slider('option', 'min')));
        $(this).val(Math.min(newValue, $(sliderId).slider('option', 'max')));

        $(sliderId).slider('value', $(this).val());
        updateColorModelValuesFromCMYK([parseFloat($('#CMYK-C').val()), parseFloat($('#CMYK-M').val()), parseFloat($('#CMYK-Y').val()), parseFloat($('#CMYK-K').val())]);
    });

    $('.hsv-color-param').on('change', function() {
        const sliderId = '#' + $(this).attr('id') + '-slider';

        const newValue = $(this).val();
        $(this).val(Math.max(newValue, $(sliderId).slider('option', 'min')));
        $(this).val(Math.min(newValue, $(sliderId).slider('option', 'max')))

        $(sliderId).slider('value', $(this).val());
        updateColorModelValuesFromHSV([parseFloat($('#hsv-hue').val()), parseFloat($('#hsv-saturation').val()), parseFloat($('#hsv-value').val())]);
    });
});


