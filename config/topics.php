<?php
/**
 * Learning Topics Configuration
 * 
 * This file defines which directories should be displayed as learning topics
 * on the main page. Only directories listed here will appear in the topic list.
 */

return [
    'basic-calculation' => [
        'name' => 'Basic Calculation',
        'description' => 'Practice addition, subtraction, multiplication, and division',
        'icon' => '➕',
        'active' => true
    ],
    'time-and-clock' => [
        'name' => 'Time And Clock',
        'description' => 'Learn to tell time and work with clocks',
        'icon' => '🕐',
        'active' => true
    ]
    
    // Add new learning topics here in the future
    // 'new-topic' => [
    //     'name' => 'New Topic Name',
    //     'description' => 'Description of the topic',
    //     'icon' => '🎯',
    //     'active' => true
    // ]
];