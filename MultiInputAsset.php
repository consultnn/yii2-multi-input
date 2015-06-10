<?php

namespace consultnn\multiInput;

use yii\web\AssetBundle;

class MultiInputAsset extends AssetBundle
{
    public $sourcePath = '@vendor/consultnn/yii2-multi-input/assets';

    public $js = [
        'multi.js'
    ];

    public $css = [
        'multi.css'
    ];

    public $depends = [
        'yii\bootstrap\BootstrapAsset',
        'yii\web\JqueryAsset'
    ];
}