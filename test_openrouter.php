<?php
$models = json_decode(file_get_contents('https://openrouter.ai/api/v1/models'), true)['data'];
foreach($models as $m) {
    if (strpos($m['id'], 'free') !== false) {
        echo $m['id'] . "\n";
    }
}
