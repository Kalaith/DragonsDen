<?php
// src/Utils/IdleNumber.php
namespace App\Utils;

/**
 * IdleNumber: Handles huge numbers as (value, exponent) pairs, e.g. 1.23e+1000
 */
class IdleNumber
{
    public float $value;
    public int $exp;

    public function __construct($value = 0, $exp = 0)
    {
        $this->value = (float)$value;
        $this->exp = (int)$exp;
        $this->normalize();
    }

    public static function fromString($str): self
    {
        if (strpos($str, 'e') !== false) {
            [$val, $exp] = explode('e', strtolower($str));
            return new self((float)$val, (int)$exp);
        }
        return new self((float)$str, 0);
    }

    public function add(IdleNumber $other): self
    {
        $a = clone $this;
        $b = clone $other;
        $diff = $a->exp - $b->exp;
        if ($diff > 0) {
            $b->value /= pow(10, $diff);
            $b->exp += $diff;
        } elseif ($diff < 0) {
            $a->value /= pow(10, -$diff);
            $a->exp -= $diff;
        }
        $result = new self($a->value + $b->value, $a->exp);
        $result->normalize();
        return $result;
    }

    public function mul($factor): self
    {
        $result = new self($this->value * $factor, $this->exp);
        $result->normalize();
        return $result;
    }

    public function normalize(): void
    {
        while (abs($this->value) >= 1000) {
            $this->value /= 1000;
            $this->exp += 3;
        }
        while (abs($this->value) > 0 && abs($this->value) < 1) {
            $this->value *= 1000;
            $this->exp -= 3;
        }
    }

    public function toString(): string
    {
        return $this->value . 'e' . $this->exp;
    }

    public function toDisplay(): string
    {
        // Letter notation: K, M, B, T, AA, AB, ...
        $units = ['', 'K', 'M', 'B', 'T'];
        $exp3 = (int)($this->exp / 3);
        if ($exp3 < count($units)) {
            return sprintf('%.3g%s', $this->value * pow(10, $this->exp % 3), $units[$exp3]);
        }
        $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $expAA = $exp3 - count($units);
        $first = intdiv($expAA, 26);
        $second = $expAA % 26;
        $suffix = $letters[$first] . $letters[$second];
        return sprintf('%.3g%s', $this->value * pow(10, $this->exp % 3), $suffix);
    }
}
