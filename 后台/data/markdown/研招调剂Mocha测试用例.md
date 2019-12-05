0. 引言

当你提交代码进行代码审查时或者创建一次pull request (这在开源项目中经常发生)，你的代码在被接受之前会被要求做一些变更。于是你进行了变更，并且直到下一次审查之前你没有再次被要求进行变更过。在你知道又要进行变更之前，你已经有了一些额外的commit。理想情况下，你可以用rebase命令把多个commit压缩成一个。

git rebase -i HEAD~[number_of_commits]

如果你想要压缩最后两个commit，你需要运行下列命令。

git rebase -i HEAD~3

为了模拟实际git rebase效果，我们先在git上提交两个修改。git log如下：

commit 7b16b280f22fe4ff57c1879867a624f6f0f14398Author: pan Date:   Sun Apr 22 08:55:32 2018 +0800    update3
commit a7186d862b95efc5cc1d7c98277af4c72bac335dAuthor: pan Date:   Sun Apr 22 08:55:16 2018 +0800    update2 
commit 16a9a4749f8ee25ab617c46925f57c2fa8a4937eAuthor: pan Date:   Sun Apr 22 08:54:55 2018 +0800    update1

假设合并这3个提交，可以按照下面过程

git rebase -i HEAD~3

执行命令后终端会出输出：

pick 16a9a47 update3 
pick a7186d8 update2
pick 7b16b28 update1
