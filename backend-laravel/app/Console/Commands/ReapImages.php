<?php

namespace App\Console\Commands;

use App\Services\ImageReaper;
use Illuminate\Console\Command;

class ReapImages extends Command
{
    protected $signature = 'images:reap
                            {--dry-run : Log what would be deleted, delete nothing}
                            {--force   : Bypass the grace window}';

    protected $description = 'Delete image files on the public disk that no DB row references.';

    public function handle(ImageReaper $reaper): int
    {
        $dryRun = (bool) $this->option('dry-run') || config('images.dry_run');
        $force  = (bool) $this->option('force');

        if ($force) {
            // Temporarily zero the grace window
            config(['images.grace_minutes' => 0]);
        }

        $this->info('Scanning public disk…');
        $this->newLine();

        $stats = $reaper->reap($dryRun);

        $this->table(
            ['Metric', 'Value'],
            [
                ['Scanned files',        $stats['scanned']],
                ['Deleted (or would-be)', $stats['deleted']],
                ['Skipped (grace window)', $stats['skipped']],
                ['DB rows pointing to missing files', count($stats['missing'])],
                ['Errors',                count($stats['errors'])],
            ]
        );

        if ($dryRun) {
            $this->warn('DRY RUN — nothing was deleted.');
        }

        if (! empty($stats['missing'])) {
            $this->newLine();
            $this->warn('Missing files referenced by the DB:');
            foreach (array_slice($stats['missing'], 0, 20) as $path) {
                $this->line("  • {$path}");
            }
        }

        return self::SUCCESS;
    }
}