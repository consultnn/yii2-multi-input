<?php

namespace consultnn\multiInput;

use yii\base\InvalidConfigException;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\ActiveForm;
use yii\widgets\InputWidget;

class MultiInput extends InputWidget
{
    /**
     * @var ActiveForm
     */
    public $form;

    public $rowView;

    public $initEmpty = true;

    public function init()
    {
        if (empty($this->form) || !($this->form instanceof ActiveForm)) {
            throw new InvalidConfigException('form required');
        }
    }

    public function run()
    {
        $this->registerClientScript();

        if (count($this->model->{$this->attribute}) === 0 && $this->initEmpty) {
            $this->initEmpty();
        }
        return $this->renderRows();
    }

    protected function initEmpty()
    {
        $this->model->{$this->attribute}[] = null;
    }

    protected function renderTemplateRow()
    {
        return Json::encode(Html::tag('div', $this->renderRow('#index#', null), ['class' => 'template']));
    }

    protected function renderRows()
    {
        $rows = [];
        if (!count($this->model->{$this->attribute}) || !$this->initEmpty) {
            $emptyAttribute = Html::activeHiddenInput($this->model, $this->attribute, [ 'value' => false]);
            $rows[] = Html::tag('div', $emptyAttribute.$this->renderAddButton() , ['class' => 'row']);
        }

        foreach($this->model->{$this->attribute} as $index => $value) {
            $rows[] = $this->renderRow($index, $value);
        }

        return Html::tag('div', implode(PHP_EOL, $rows), ['id' => $this->id, 'class' => 'multiply-input-rows']);
    }

    protected function renderAddButton()
    {
        return Html::tag('span', null, ['class' => 'glyphicon glyphicon-plus form-control-static col-lg-1 col-sm-1 add-row']);
    }

    protected function renderButton($index)
    {
        if ($index === 0 && $this->initEmpty) {
            return $this->renderAddButton();
        }
        return Html::tag('span', null, ['class' => 'glyphicon glyphicon-trash form-control-static col-lg-1 col-sm-1 remove-row']);
    }

    protected function renderRow($index, $value)
    {
        if (!empty($this->rowView)) {
            $row = $this->render($this->rowView, [
                'index' => $index,
                'value' => $value,
                'form' => $this->form,
                'model' => $this->model,
                'attribute' => $this->attribute
            ]);
        } else {
            $row = $this->form->field($this->model, "{$this->attribute}[{$index}]", ['options' => ['class' => 'col-lg-11']]);
        }

        $button = $this->renderButton($index);
        return Html::tag('div', $row.$button , ['class' => 'row']);
    }

    protected function registerClientScript()
    {
        $view = $this->getView();

        MultiInputAsset::register($view);

        $maxIndex = count($this->model->{$this->attribute});
        $js = "jQuery('#{$this->id}').multiInput({template: {$this->renderTemplateRow()}, maxIndex: {$maxIndex}});";
        $view->registerJs($js);
    }
}